import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabaseClient'
import prisma from '@/lib/prisma'
import dotenv from 'dotenv'
// export const maxDuration = 300
export const dynamic = 'force-dynamic'

dotenv.config()

export async function POST(request: NextRequest) {
  // 프론트에서 보낸 formData 엔트리(File)
  const formData = await request.formData()
  const inputDataEntry = formData.get('input_data')
  const profileImageEntry = formData.get('profile_img')

  if (!formData) throw Error('프론트에서 회원가입 데이터를 받지 못했습니다.')
  console.log('formData ========>', formData)

  if (!inputDataEntry) throw Error('사용자 인풋 데이터 File을 받지 못했습니다.')
  console.log('inputDataEntry ========>', inputDataEntry)

  // File 데이터 Blob으로 처리 및 JSON 데이터로 파싱
  const inputDataText = typeof inputDataEntry === 'string' ? inputDataEntry : await (inputDataEntry as Blob).text()
  const inputData = JSON.parse(inputDataText)
  console.log('File 사용자 인풋 데이터 파싱 결과 =========>', inputData)

  // 비밀번호 해시 암호화
  const hashedPassword = bcrypt.hashSync(inputData.password, 10)

  // 최종 저장 프로필 이미지 변수
  let profile_img_result

  // 기본 제공 프로필 이미지를 사용하는 경우 undefined
  if (profileImageEntry === 'undefined') {
    profile_img_result = profileImageEntry
    console.log('기본 프로필 사용 ========>', profile_img_result)
  } else if (profileImageEntry) {
    // 별도 프로필 이미지 사용하는 경우, supabase publicUrl 생성
    const profileFile = profileImageEntry as File
    const extension = profileFile.name.split('.').pop()?.toLowerCase()
    const fileName = extension ? `${uuidv4()}-${inputData.id}.${extension}` : `${uuidv4()}-${inputData.id}`
    const { data, error } = await supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).upload(fileName, profileImageEntry, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      console.error('Supabase upload error:', error)
      throw Error('Supabase Storage 업로드 에러입니다.')
    }

    const filePath = data.path
    console.log('========>', filePath)

    const profileImg = supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).getPublicUrl(`${filePath}`)
    console.log('========>', profileImg.data.publicUrl)

    profile_img_result = profileImg.data.publicUrl
    console.log('별도 프로필 사용 ========>', profile_img_result)
  }

  console.log(inputData.agreements)

  // DB 생성
  try {
    const new_user = await prisma.user.create({
      data: {
        provider: 'credential',
        user_type: inputData.user_type,
        name: inputData.name,
        id: inputData.id,
        email: inputData.email,
        password: hashedPassword,
        profile_img: profile_img_result!,
        agreements: {
          create: inputData.agreements.map((item: any) => ({
            type: item.type,
            agreed: item.agreed,
          })),
        },
      },
      include: {
        agreements: true,
      },
    })

    const { password, ...infoWithOutPW } = new_user
    return NextResponse.json(infoWithOutPW)
  } catch (error) {
    throw new Error(`SignUp Error: ${error}`)
  }
}

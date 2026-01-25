'use server'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

//사용자 신규 비밀번호 업데이트
export const updateUserPw = async (idx: string, new_pw: string) => {
  const user = await prisma.user.findUnique({
    where: {
      idx: idx,
    },
  })

  // 사용자 idx 검증
  if (!user) throw new Error('==========================> 권한이 없는 계정입니다.')

  // 기존 비밀번호와 신규 비밀번호가 같은지 검증
  const isPasswordSame = await bcrypt.compare(new_pw, user.password)

  if (!isPasswordSame) {
    // 신규 비밀번호 해시 암호화
    const hashedPassword = bcrypt.hashSync(new_pw, 10)

    // DB 업데이트
    const user = await prisma.user.update({
      where: {
        idx: idx,
      },
      data: {
        password: hashedPassword,
      },
    })
  }

  return isPasswordSame
}

//사용자 현재 비밀번호 확인
export const confirmCurrentPw = async (idx: string, input_pw: string) => {
  const user = await prisma.user.findUnique({
    where: {
      idx: idx,
    },
  })

  // 사용자 idx 검증
  if (!user) throw new Error('==========================> 권한이 없는 계정입니다.')

  // 비밀번호 검증
  const isPasswordCorrect = await bcrypt.compare(input_pw, user.password)

  // 사용자 인증 성공
  return isPasswordCorrect
}

//사용자 프로필 이미지 업데이트
export const updateUserProfile = async (id: string, new_profile?: FormData) => {
  if (!new_profile) return new Error('프론트에서 업데이트 이미지를 받지못했습니다.')
  console.log(new_profile)

  const profileImageEntry = new_profile.get('profile_img')

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
    const fileName = extension ? `${uuidv4()}-${id}.${extension}` : `${uuidv4()}-${id}`
    const { data, error } = await supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).upload(fileName, profileImageEntry, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) throw Error('Supabase Storage 업로드 에러입니다.')

    const filePath = data.path
    console.log('========>', filePath)

    const profileImg = supabase.storage.from(process.env.NEXT_PUBLIC_PROJECT_DIR!).getPublicUrl(`${filePath}`)
    console.log('========>', profileImg.data.publicUrl)

    profile_img_result = profileImg.data.publicUrl
    console.log('별도 프로필 사용 ========>', profile_img_result)
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        profile_img: profile_img_result,
      },
    })

    return user.profile_img
  } catch (error) {
    throw new Error('프로필 이미지 업로드에 실패했습니다. 다시 시도해주세요.')
  }
}

//사용자 이름 업데이트
export const updateUserName = async (idx: string, new_name: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        idx: idx,
      },
      data: {
        name: new_name,
      },
    })

    return user
  } catch (error) {
    console.log(error)
    throw new Error(`사용자 이름 업데이트에 실패했습니다. 다시 시도해주세요.`)
  }
}

//사용자 정보 동의서 업데이트
interface UpdateUserAgreementParams {
  agreementIdx: string
  userIdx: string
  selectable_agreement: boolean
}

export const updateUserAgreement = async ({ agreementIdx, userIdx, selectable_agreement }: UpdateUserAgreementParams) => {
  try {
    console.log(agreementIdx, userIdx, selectable_agreement)
    const user = await prisma.agreement.update({
      where: {
        id: agreementIdx,
        userIdx: userIdx,
      },
      data: {
        agreed: selectable_agreement,
      },
    })

    return { success: true }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to update agreements' }
  }
}

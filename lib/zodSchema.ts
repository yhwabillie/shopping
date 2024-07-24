import { z } from 'zod'

export const signUpSchema = z.object({
  user_type: z.enum(['indivisual', 'admin']),
  name: z.string().regex(/^[ㄱ-ㅎ가-힣]{4,8}$/g, '4자-8자 사이의 한글로 작성하세요 (공백, 특수문자 X)'),
  id: z.string().regex(/^[a-zA-Z]+[a-zA-Z0-9]{6,10}$/g, '6자-10자 사이 영문자로 시작하는 영문과 숫자의 조합으로 작성하세요 (공백, 특수문자 X)'),
  email: z
    .string()
    .regex(/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, '이메일 형식에 맞게 공백을 제외하고 작성해주세요. (EX. test@test.com)'),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,15}$/,
      '8자-15자, 영문자 & 숫자 & 특수문자의 조합으로 작성해주세요. (공백 제외)',
    ),
})

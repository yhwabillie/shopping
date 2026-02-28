import authOptions from '@/lib/auth'
import { SectionHeader } from '@/lib/components/individual/SectionHeader'
import { UserShoppingTabs } from '@/lib/components/individual/UserShoppingTabs'
import { Metadata } from 'next'
import { getServerSession, Session } from 'next-auth'
import { redirect } from 'next/navigation'

// 페이지가 동적으로 생성되도록 설정
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '마이쇼핑',
}

export default async function Page() {
  // getServerSession 자체 에러처리
  const session: Session | null = await getServerSession(authOptions).catch((error) => {
    console.error('Failed to get session:', error)
    return redirect('/signIn')
  })

  // 세션이 없거나, 세션의 user.idx가 없는 경우 로그인 페이지로 리다이렉트
  // 리다이렉트 후 코드 실행 중단
  if (!session || !session.user?.idx) {
    return redirect('/signIn')
  }

  return (
    <section aria-labelledby="page-heading" className="container mx-auto mb-6 min-w-[344px]">
      <h2 id="page-heading" className="sr-only">
        마이쇼핑 본문
      </h2>
      <SectionHeader title="🛍️ MY SHOPPING" desc="배송정보, 위시리스트, 장바구니, 주문 상세정보를 확인하세요" />
      <main className="mx-4 overflow-hidden rounded-lg bg-white p-4 md:mx-0 md:p-10">
        <UserShoppingTabs session={session} />
      </main>
    </section>
  )
}

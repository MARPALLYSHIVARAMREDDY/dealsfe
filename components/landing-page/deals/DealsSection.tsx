import { getTopDeals } from '@/lib/alldeals-service'
import { type LocaleCode } from '@/lib/locale-utils'
import DealsClient from './DealsClient'

interface DealsSectionProps {
  params: Promise<{ locale: string }>
}

export default async function DealsSection({ params }: DealsSectionProps) {
  const { locale } = await params

  // Fetch latest 12 deals
  const result = await getTopDeals(locale as LocaleCode, 100)
  const deals = result.success ? result.data : []

  return <DealsClient locale={locale} deals={deals} />
}

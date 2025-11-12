import { useEffect, use } from "react"
import { useTranslations } from "next-intl"
import { useBreadcrumb } from "@/app/breadcrumb-provider"
import { PublicIdBadge } from "@/components/public-id-badge"
import { useDepositAccount } from "@/hooks/deposit-account/use-deposit-account"
import type { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"

export function useDepositAccountPage(
  params: Promise<{
    "deposit-account-id": string
  }>
): {
  depositAccount: DepositAccountData | null
  loading: boolean
  error: Error | undefined
  notFound: boolean
} {
  const { "deposit-account-id": publicId } = use(params)
  const { setCustomLinks, resetToDefault } = useBreadcrumb()
  const navTranslations = useTranslations("Sidebar.navItems")

  const { depositAccount, loading, error, notFound } = useDepositAccount(publicId)

  useEffect(() => {
    if (depositAccount) {
      setCustomLinks([
        { title: navTranslations("depositAccounts"), href: "/deposit-accounts" },
        {
          title: <PublicIdBadge publicId={depositAccount.publicId} />,
          isCurrentPage: true,
        },
      ])
    }
    return () => {
      resetToDefault()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAccount])

  return {
    depositAccount,
    loading,
    error,
    notFound,
  }
}


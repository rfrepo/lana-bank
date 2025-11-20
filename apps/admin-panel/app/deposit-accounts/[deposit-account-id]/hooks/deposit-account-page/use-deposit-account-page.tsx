import { useEffect, use } from "react"
import { useTranslations } from "next-intl"

import { useBreadcrumb } from "@/app/breadcrumb-provider"
import { PublicIdBadge } from "@/components/public-id-badge"
import { useDepositAccount, type DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"
import {
  useSetContextMenuData,
  useClearContextMenuButtonProps,
} from "@/components/context-menu-actions/store/context-menu-actions-store"

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
  const { setCustomLinks } = useBreadcrumb()
  const navTranslations = useTranslations("Sidebar.navItems")

  const setContextMenuData = useSetContextMenuData<DepositAccountData>()
  const clearButtonProps = useClearContextMenuButtonProps()

  const { depositAccount, loading, error, notFound } = useDepositAccount(publicId)

  useEffect(() => {
    if (!depositAccount) return

    setContextMenuData(depositAccount)

    setCustomLinks([
      { title: navTranslations("depositAccounts"), href: "/deposit-accounts" },
      {
        title: <PublicIdBadge publicId={depositAccount.publicId} />,
        isCurrentPage: true,
      },
    ])

    return () => {
      clearButtonProps()
      setContextMenuData(null)
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


"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"

import { useBreadcrumb } from "@/app/breadcrumb-provider"
import { PublicIdBadge } from "@/components/public-id-badge"

import { GetDepositAccountDetailsPageQuery } from "@/lib/graphql/generated"

type DepositAccount = NonNullable<
  Extract<
    NonNullable<GetDepositAccountDetailsPageQuery["publicIdTarget"]>,
    { __typename: "DepositAccount" }
  >
>

export function useDepositAccountBreadcrumb(
  depositAccount: DepositAccount | null | undefined,
) {
  const { setCustomLinks, resetToDefault } = useBreadcrumb()
  const navTranslations = useTranslations("Sidebar.navItems")

  useEffect(() => {
    if (depositAccount) {
      setCustomLinks([
        { title: navTranslations("depositAccounts"), href: "/deposit-accounts" },
        {
          isCurrentPage: true,
          title: <PublicIdBadge publicId={depositAccount.publicId} />,
        },
      ])
    }
    return () => {
      resetToDefault()
    }
  }, [depositAccount, resetToDefault, setCustomLinks, navTranslations])
}

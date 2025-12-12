"use client"

import { useTranslations } from "next-intl"

export function ErrorState() {
  const t = useTranslations("DepositAccounts.DepositAccountDetails")

  return (
    <main className="max-w-7xl m-auto space-y-2">
      <div className="text-destructive">{t("errors.loadError")}</div>
    </main>
  )
}


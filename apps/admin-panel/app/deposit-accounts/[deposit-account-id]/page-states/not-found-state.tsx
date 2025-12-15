"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

export function NotFoundState() {
  const t = useTranslations("DepositAccounts.DepositAccountDetails")

  return (
    <main className="max-w-7xl m-auto space-y-2">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{t("errors.notFound")}</h1>
        <p className="text-muted-foreground">
          {t("errors.notFoundDescription")}
        </p>
        <Link href="/deposit-accounts">
          <button className="text-primary underline">
            {t("errors.backToDepositAccounts")}
          </button>
        </Link>
      </div>
    </main>
  )
}


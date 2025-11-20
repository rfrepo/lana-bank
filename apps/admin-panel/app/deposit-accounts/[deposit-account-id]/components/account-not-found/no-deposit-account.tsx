"use client"

import { useTranslations } from "next-intl"

export default function NoDepositAccount() {
  const t = useTranslations("DepositAccounts.DepositAccountDetails")

  return (
    <main className="max-w-7xl m-auto">
      <div
        role="alert"
        aria-atomic="true"
        aria-live="polite"
        className="text-destructive"
      >
        <h1 className="text-2xl font-semibold mb-2">{t("notFound.title")}</h1>
        <p>
          {t("notFound.message")}
        </p>
      </div>
    </main>
  )
}

"use client"

import { useTranslations } from "next-intl"

export default function NoDepositAccount() {
  const t = useTranslations("Common")

  return (
    <main className="max-w-7xl m-auto">
      <div
        role="alert"
        aria-atomic="true"
        aria-live="polite"
        className="text-destructive"
      >
        <h1 className="text-2xl font-semibold mb-2">Deposit Account Not Found</h1>
        <p>
          {t("notFound") || "The deposit account you are looking for could not be found."}
        </p>
      </div>
    </main>
  )
}

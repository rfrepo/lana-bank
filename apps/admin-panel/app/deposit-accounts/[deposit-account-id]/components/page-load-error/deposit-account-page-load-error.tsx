"use client"

import { useTranslations } from "next-intl"

interface DepositAccountPageLoadErrorProps {
    error: Error
}

export default function DepositAccountPageLoadError({
    error,
}: DepositAccountPageLoadErrorProps) {
    const t = useTranslations("DepositAccounts.DepositAccountDetails")
    
    return (
        <main className="max-w-7xl m-auto">
            <div className="text-destructive" role="alert">
                {error.message || t("errors.loadError")}
            </div>
        </main>
    )
}


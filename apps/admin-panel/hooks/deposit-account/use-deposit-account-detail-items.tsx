import React from "react"
import { useTranslations } from "next-intl"

import Balance from "@/components/balance/balance"
import { DetailItemProps } from "@/components/details"
import { DepositAccountStatusBadge } from "@/components/deposit-account/status-badge"

import { DepositAccountBalance, DepositAccountStatus } from "@/lib/graphql/generated"

type UseDepositAccountDetailItemsParams = {
    translationKey: string
    status: DepositAccountStatus
    balance: DepositAccountBalance
}

export const useDepositAccountDetailItems = ({
    status,
    balance,
    translationKey,
}: UseDepositAccountDetailItemsParams): DetailItemProps[] => {
    const t = useTranslations(translationKey)

    return [
        {
            label: t("labels.checkingSettled"),
            value: <Balance amount={balance.settled} currency="usd" />,
        },
        {
            label: t("labels.pendingWithdrawals"),
            value: <Balance amount={balance.pending} currency="usd" />,
        },
        {
            label: t("labels.status"),
            value: <DepositAccountStatusBadge status={status} />,
        },
    ]
}



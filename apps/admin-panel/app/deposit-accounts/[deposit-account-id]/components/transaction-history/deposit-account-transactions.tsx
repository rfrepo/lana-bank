"use client"

import { useTranslations } from "next-intl"

import {
  TransactionTableCard,
  useTransactionColumns,
  RendererConfigFactory,
} from "@/components/transaction-table"
import { useTransactionHistory } from "@/hooks/transaction-history/use-transaction-history"

type DepositAccountTransactionsProps = {
    depositAccountId: string
}

export function DepositAccountTransactions({
    depositAccountId,
}: DepositAccountTransactionsProps) {
    const t = useTranslations("DepositAccounts.DepositAccountDetails.transactions")

    const { data, loading } = useTransactionHistory({
        source: { type: 'depositAccount', depositAccountId },
    })

    const rendererConfig = RendererConfigFactory.forMixedHistory()

    const columns = useTransactionColumns({
        translationNamespace: "DepositAccounts.DepositAccountDetails.transactions",
    },
        rendererConfig
    )

    return (
        <TransactionTableCard
            title={t("title")}
            description={t("description")}
            data={data}
            columns={columns}
            rendererConfig={rendererConfig}
            loading={loading}
            emptyMessage={t("table.empty")}
        />
    )
}


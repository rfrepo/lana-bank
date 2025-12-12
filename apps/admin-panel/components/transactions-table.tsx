"use client"

import React from "react"
import { useTranslations } from "next-intl"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@lana/web/ui/card"

import DateWithTooltip from "@lana/web/components/date-with-tooltip"

import Balance from "@/components/balance/balance"
import DataTable, { Column } from "@/components/data-table"
import { DepositAccountHistoryEntryFieldsFragment } from "@/lib/graphql/generated"
import { WithdrawalStatusBadge } from "@/app/withdrawals/status-badge"
import { DepositStatusBadge } from "@/app/deposits/status-badge"
import { DisbursalStatusBadge } from "@/app/disbursals/status-badge"

type HistoryNode = DepositAccountHistoryEntryFieldsFragment

type TransactionsTableProps = {
    historyEntries: HistoryNode[]
    translationKey: string
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
    historyEntries,
    translationKey,
}) => {
    const t = useTranslations(translationKey)

    const validEntries = historyEntries.filter(
        (entry) =>
            entry.__typename &&
            [
                "DepositEntry",
                "WithdrawalEntry",
                "CancelledWithdrawalEntry",
                "DisbursalEntry",
                "PaymentEntry",
            ].includes(entry.__typename),
    )

    const columns: Column<HistoryNode>[] = [
        {
            key: "__typename",
            header: t("table.headers.date"),
            render: (_: HistoryNode["__typename"], entry: { recordedAt: string }) => {
                if (!entry.recordedAt) return "-"
                return <DateWithTooltip value={entry.recordedAt} />
            },
        },
        {
            key: "__typename",
            header: t("table.headers.type"),
            render: (type: HistoryNode["__typename"]) => {
                switch (type) {
                    case "DepositEntry":
                        return t("table.types.deposit")
                    case "WithdrawalEntry":
                    case "CancelledWithdrawalEntry":
                        return t("table.types.withdrawal")
                    case "DisbursalEntry":
                        return t("table.types.disbursal")
                    case "PaymentEntry":
                        return t("table.types.payment")
                    default:
                        return "-"
                }
            },
        },
        {
            key: "__typename",
            header: t("table.headers.amount"),
            render: (_: HistoryNode["__typename"], entry: HistoryNode) => {
                switch (entry.__typename) {
                    case "DepositEntry":
                        return <Balance amount={entry.deposit.amount} currency="usd" />
                    case "WithdrawalEntry":
                    case "CancelledWithdrawalEntry":
                        return <Balance amount={entry.withdrawal.amount} currency="usd" />
                    case "DisbursalEntry":
                        return <Balance amount={entry.disbursal.amount} currency="usd" />
                    case "PaymentEntry":
                        return <Balance amount={entry.payment.amount} currency="usd" />
                    default:
                        return "-"
                }
            },
        },
        {
            key: "__typename",
            header: t("table.headers.status"),
            render: (_: HistoryNode["__typename"], entry: HistoryNode) => {
                switch (entry.__typename) {
                    case "DepositEntry":
                        return <DepositStatusBadge status={entry.deposit.status} />
                    case "WithdrawalEntry":
                    case "CancelledWithdrawalEntry":
                        return <WithdrawalStatusBadge status={entry.withdrawal.status} />
                    case "DisbursalEntry":
                        return <DisbursalStatusBadge status={entry.disbursal.status} />
                    default:
                        return "-"
                }
            },
        },
    ]

    const getNavigateUrl = (entry: HistoryNode): string | null => {
        switch (entry.__typename) {
            case "DepositEntry":
                return `/deposits/${entry.deposit.publicId}`
            case "WithdrawalEntry":
            case "CancelledWithdrawalEntry":
                return `/withdrawals/${entry.withdrawal.publicId}`
            case "DisbursalEntry":
                return `/disbursals/${entry.disbursal.publicId}`
            default:
                return null
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={validEntries}
                    columns={columns}
                    emptyMessage={t("table.empty")}
                    navigateTo={getNavigateUrl}
                    className="w-full table-fixed"
                    headerClassName="bg-secondary [&_tr:hover]:!bg-secondary"
                />
            </CardContent>
        </Card>
    )
}


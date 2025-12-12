import { useTranslations } from "next-intl"

import DateWithTooltip from "@lana/web/components/date-with-tooltip"

import { HistoryNode } from "./utils"

import Balance from "@/components/balance/balance"
import { Column } from "@/components/paginated-table"
import { DepositStatusBadge } from "@/app/deposits/status-badge"
import { WithdrawalStatusBadge } from "@/app/withdrawals/status-badge"
import { DisbursalStatusBadge } from "@/app/disbursals/status-badge"

const renderDate = (_: HistoryNode["__typename"], entry: { recordedAt: string }) =>
  entry.recordedAt ? <DateWithTooltip value={entry.recordedAt} /> : "-"

const renderType = (type: HistoryNode["__typename"], t: ReturnType<typeof useTranslations>) => {
  switch (type) {
    case "DepositEntry": return t("table.types.deposit")
    case "PaymentEntry": return t("table.types.payment")
    case "DisbursalEntry": return t("table.types.disbursal")
    case "WithdrawalEntry":
    case "CancelledWithdrawalEntry": return t("table.types.withdrawal")
    default: return "-"
  }
}

const renderAmount = (_: HistoryNode["__typename"], entry: HistoryNode) => {
  switch (entry.__typename) {
    case "DepositEntry": return <Balance amount={entry.deposit.amount} currency="usd" />
    case "PaymentEntry": return <Balance amount={entry.payment.amount} currency="usd" />
    case "DisbursalEntry": return <Balance amount={entry.disbursal.amount} currency="usd" />
    case "WithdrawalEntry":
    case "CancelledWithdrawalEntry": return <Balance amount={entry.withdrawal.amount} currency="usd" />
    default: return "-"
  }
}

const renderStatus = (_: HistoryNode["__typename"], entry: HistoryNode) => {
  switch (entry.__typename) {
    case "DepositEntry": return <DepositStatusBadge status={entry.deposit.status} />
    case "DisbursalEntry": return <DisbursalStatusBadge status={entry.disbursal.status} />
    case "WithdrawalEntry":
    case "CancelledWithdrawalEntry": return <WithdrawalStatusBadge status={entry.withdrawal.status} />
    default: return "-"
  }
}

export const createColumns = (
  t: ReturnType<typeof useTranslations>,
): Column<HistoryNode>[] => [
    {
      key: "__typename",
      render: renderDate,
      label: t("table.headers.date"),
    },
    {
      key: "__typename",
      label: t("table.headers.type"),
      render: (type: HistoryNode["__typename"]) => renderType(type, t),
    },
    {
      key: "__typename",
      render: renderAmount,
      label: t("table.headers.amount"),
    },
    {
      key: "__typename",
      render: renderStatus,
      label: t("table.headers.status"),
    },
  ]

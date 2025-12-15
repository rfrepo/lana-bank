import { useTranslations } from "next-intl"

import { DepositAccountStatusBadge } from "@/components/deposit-account/status-badge"

import { DepositAccount } from "@/lib/graphql/generated"

import Balance from "@/components/balance/balance"
import { PublicIdBadge } from "@/components/public-id-badge"
import { Column } from "@/components/paginated-table"

const renderPublicId = (publicId: string) => <PublicIdBadge publicId={publicId} />

const renderCustomerEmail = (customer: DepositAccount["customer"]) => customer?.email ?? "-"

const renderSettledBalance = (_: unknown, record: DepositAccount) => (
  <Balance amount={record.balance?.settled ?? 0} currency="usd" />
)

const renderPendingBalance = (_: unknown, record: DepositAccount) => (
  <Balance amount={record.balance?.pending ?? 0} currency="usd" />
)

const renderStatus = (status: DepositAccount["status"]) => (
  <DepositAccountStatusBadge status={status} />
)

export const createColumns = (
  t: ReturnType<typeof useTranslations>,
): Column<DepositAccount>[] => [
    {
      key: "publicId",
      render: renderPublicId,
      label: t("headers.depositAccountId"),
    },
    {
      key: "customer",
      render: renderCustomerEmail,
      label: t("headers.customerName"),
    },
    {
      key: "balance",
      render: renderSettledBalance,
      label: t("headers.settledBalance"),
    },
    {
      key: "balance",
      render: renderPendingBalance,
      label: t("headers.pendingBalance"),
    },
    {
      key: "status",
      render: renderStatus,
      label: t("headers.status"),
    },
  ]


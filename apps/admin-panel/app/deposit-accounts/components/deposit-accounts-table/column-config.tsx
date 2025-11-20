import { useTranslations } from "next-intl";

import { UsdCents } from "@/types/scalars";
import Balance from "@/components/balance/balance";
import { Column } from "@/components/paginated-table";
import { DepositAccountItem } from "@/app/deposit-accounts/types";
import { DepositAccountStatusBadge } from "@/app/deposit-accounts/[deposit-account-id]/components/account-overview/deposit-account-details";

export const getColumnsConfig = (t: ReturnType<typeof useTranslations>): Column<DepositAccountItem>[] => [
    {
        key: "email",
        label: t("headers.customer"),
        sortable: true,
        render: (email: string) => email,
    },
    {
        key: "id",
        label: t("headers.depositAccountId"),
        sortable: true,
        render: (_: string, record: DepositAccountItem) => record.publicId,
    },
    {
        key: "status",
        label: t("headers.status"),
        sortable: true,
        render: (status: DepositAccountItem["status"]) => (
            status ? <DepositAccountStatusBadge status={status} /> : null
        ),
    },
    {
        key: "balance",
        label: t("headers.pendingBalance"),
        sortable: true,
        render: (balance: DepositAccountItem["balance"]) => (
            <Balance
                amount={balance.pending as unknown as UsdCents}
                currency="usd"
            />
        ),
    },
    {
        key: "balance",
        label: t("headers.settledBalance"),
        sortable: true,
        render: (balance: DepositAccountItem["balance"]) => (
            <Balance
                amount={balance.settled as unknown as UsdCents}
                currency="usd"
            />
        ),
    },
]
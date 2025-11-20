import type { TableRendererConfig } from "./renderer-config"

import type { Column } from "@/components/data-table"
import type { 
  GetCustomerTransactionHistoryQuery,
  GetDepositAccountTransactionHistoryQuery,
} from "@/lib/graphql/generated"

type CustomerHistoryNode = NonNullable<
  NonNullable<GetCustomerTransactionHistoryQuery["customerByPublicId"]>["depositAccount"]
>["history"]["edges"][number]["node"]

type DepositAccountHistoryNode = NonNullable<
  Extract<
    NonNullable<GetDepositAccountTransactionHistoryQuery["publicIdTarget"]>,
    { __typename: "DepositAccount" }
  >
>["history"]["edges"][number]["node"]

export type HistoryNode = CustomerHistoryNode | DepositAccountHistoryNode

export type TransactionHistorySource = 
  | { type: 'customer'; customerId: string }
  | { type: 'depositAccount'; depositAccountId: string }

export const ColumnType = {
  DATE: 'date',
  TYPE: 'type',
  AMOUNT: 'amount',
  STATUS: 'status',
} as const

export type ColumnType = typeof ColumnType[keyof typeof ColumnType]

export interface TransactionTableProps {
  data: HistoryNode[]
  rendererConfig: TableRendererConfig
  columns: Column<HistoryNode>[]
  loading?: boolean
  emptyMessage?: React.ReactNode
  navigateTo?: (entry: HistoryNode) => string | null
  filter?: (entry: HistoryNode) => boolean
  className?: string
  headerClassName?: string
}

export interface TransactionTableCardProps extends TransactionTableProps {
  title: string
  description?: string
}

export interface ColumnConfigOptions {
  translationNamespace: string
  columnOrder?: ColumnType[]
  customRenderers?: {
    date?: (entry: HistoryNode) => React.ReactNode
    type?: (entry: HistoryNode) => React.ReactNode
    amount?: (entry: HistoryNode) => React.ReactNode
    status?: (entry: HistoryNode) => React.ReactNode
  }
}


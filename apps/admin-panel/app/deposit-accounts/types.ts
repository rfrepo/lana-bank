import {
  CustomersFilter,
  CustomersSort,
  CustomersWithDepositAccountsQuery,
  DepositAccountStatus,
} from "@/lib/graphql/generated"

export type CustomerNode = NonNullable<
  CustomersWithDepositAccountsQuery["customers"]
>["edges"][number]["node"]

export type CustomerEdge = NonNullable<
  CustomersWithDepositAccountsQuery["customers"]
>["edges"][number]

export type CustomerWithDepositAccountNode = Extract<
CustomerNode,
{ depositAccount: DepositAccountNode }
>

export type DepositAccountItem = {
  id: string
  email: string
  publicId: string
  balance: {
    settled: number
    pending: number
  }
  depositAccountId: string
  status: DepositAccountStatus | null
}

export type DepositAccountsVariables = {
  first: number
  after?: string | null
  sort?: CustomersSort | null
  filter?: CustomersFilter | null
}

export type DepositAccountNode = NonNullable<CustomerNode["depositAccount"]> 
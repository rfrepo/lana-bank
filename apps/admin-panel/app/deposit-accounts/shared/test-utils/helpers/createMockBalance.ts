import type { GetCustomerBasicDetailsQuery } from '@/lib/graphql/generated'
import { UsdCents } from '@/types/scalars'

type Balance = NonNullable<
  NonNullable<GetCustomerBasicDetailsQuery["customerByPublicId"]>["depositAccount"]
>["balance"]

export const createMockBalance = (overrides?: Partial<Balance>): Balance => ({
  __typename: 'DepositAccountBalance',
  settled: 1000 as UsdCents,
  pending: 500 as UsdCents,
  ...overrides,
})


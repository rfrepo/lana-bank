import { DepositAccountStatus, type GetCustomerBasicDetailsQuery } from '@/lib/graphql/generated'
import { UsdCents } from '@/types/scalars'

type DepositAccount = NonNullable<GetCustomerBasicDetailsQuery['customerByPublicId']>['depositAccount']

export const createMockDepositAccount = (
  overrides?: Partial<NonNullable<DepositAccount>>
): NonNullable<DepositAccount> => ({
  __typename: 'DepositAccount',
  publicId: 'test-public-id',
  status: DepositAccountStatus.Active,
  balance: {
    __typename: 'DepositAccountBalance',
    settled: 1000 as UsdCents,
    pending: 500 as UsdCents,
  },
  ...overrides,
})


import { jest } from "@jest/globals"

import type { GetCustomerBasicDetailsQuery } from '@/lib/graphql/generated'

import { createMockBalance } from '@/app/deposit-accounts/shared/test-utils/helpers'

type Balance = NonNullable<
  NonNullable<GetCustomerBasicDetailsQuery["customerByPublicId"]>["depositAccount"]
>["balance"]

export const createMockFreezeDialogProps = (overrides?: {
  openFreezeDialog?: boolean
  depositAccountId?: string
  balance?: Balance
}) => ({
  openFreezeDialog: true,
  setOpenFreezeDialog: jest.fn(),
  depositAccountId: 'test-id',
  balance: createMockBalance(),
  ...overrides,
})


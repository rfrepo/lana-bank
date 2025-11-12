import { jest } from "@jest/globals"
import type { GetCustomerBasicDetailsQuery } from '@/lib/graphql/generated'

type Balance = NonNullable<
  NonNullable<GetCustomerBasicDetailsQuery["customerByPublicId"]>["depositAccount"]
>["balance"]

export const createMockBalance = (overrides?: Partial<Balance>): Balance => ({
  settled: 1000,
  pending: 500,
  ...overrides,
})

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


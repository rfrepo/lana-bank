import type { DepositAccountData } from '@/hooks/deposit-account/use-deposit-account'
import { DepositAccountStatus } from '@/lib/graphql/generated'

export const createMockDepositAccount = (
  overrides?: Partial<DepositAccountData>
): DepositAccountData => ({
  balance: {
    settled: 1000,
    pending: 500,
  },
  publicId: 'test-public-id',
  status: DepositAccountStatus.Active,
  depositAccountId: 'test-deposit-account-id',
  ledgerAccounts: {
    depositAccountId: 'ledger-account-id',
    frozenDepositAccountId: 'frozen-ledger-account-id',
  },
  ...overrides,
})


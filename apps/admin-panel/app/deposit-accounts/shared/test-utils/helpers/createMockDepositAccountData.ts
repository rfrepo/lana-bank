import type { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"
import { DepositAccountStatus } from "@/lib/graphql/generated"
import { UsdCents } from "@/types/scalars"

export const createMockDepositAccountData = (
  overrides?: Partial<DepositAccountData>
): DepositAccountData => ({
  balance: {
    settled: 1000 as UsdCents,
    pending: 500 as UsdCents,
  },
  publicId: "test-public-id",
  status: DepositAccountStatus.Active,
  depositAccountId: "test-deposit-account-id",
  ledgerAccounts: {
    depositAccountId: "ledger-account-id",
    frozenDepositAccountId: "frozen-ledger-account-id",
  },
  customer: {
    id: "customer-id",
    customerId: "customer-uuid",
    publicId: "customer-public-id",
    email: "test@example.com",
    telegramId: "telegram-123",
  },
  ...overrides,
} as DepositAccountData)


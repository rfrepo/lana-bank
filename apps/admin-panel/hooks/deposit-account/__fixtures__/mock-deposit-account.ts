import {
  Activity,
  Customer,
  DepositAccount,
  DepositAccountStatus,
  KycVerification,
  LedgerAccount,
  LedgerAccountBalanceRange,
  DebitOrCredit,
} from "@/lib/graphql/generated"
import { UsdCents } from "@/types/scalars"

// Simple mock implementations to avoid ES module issues with generated mocks
const createMockLedgerAccount = (overrides: Partial<LedgerAccount> = {}): LedgerAccount => ({
  __typename: "LedgerAccount" as const,
  id: overrides.id || "ledger-account-1",
  ledgerAccountId: overrides.ledgerAccountId || "uuid-ledger-account-1",
  name: overrides.name || "Ledger Account",
  ancestors: [],
  children: [],
  history: {
    __typename: "JournalEntryConnection" as const,
    edges: [],
    nodes: [],
    pageInfo: {
      __typename: "PageInfo" as const,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  },
  balanceRange: {} as LedgerAccountBalanceRange,
  isRootAccount: false,
  normalBalanceType: DebitOrCredit.Debit,
  code: null,
  entity: null,
  closestAccountWithCode: null,
  ...overrides,
})

const createMockCustomer = (overrides: Partial<Customer> = {}): Customer =>
  ({
    __typename: "Customer" as const,
    id: overrides.id || "customer-1",
    customerId: overrides.customerId || "uuid-customer-1",
    publicId: overrides.publicId || "67890",
    email: overrides.email || "test@example.com",
    telegramId: overrides.telegramId || "telegram-123",
    activity: Activity.Active,
    createdAt: "2024-01-01T00:00:00Z",
    creditFacilities: [],
    creditFacilityProposals: [],
    depositAccount: undefined,
    documents: [],
    kycVerification: KycVerification.Verified,
    userCanCreateCreditFacility: false,
    ...overrides,
  } as Customer)

export const mockDepositAccount = (): DepositAccount => ({
  __typename: "DepositAccount" as const,
  id: "deposit-account-1",
  depositAccountId: "uuid-deposit-account-1",
  customerId: "uuid-customer-1",
  createdAt: "2024-01-01T00:00:00Z",
  status: DepositAccountStatus.Active,
  publicId: "12345",
  balance: {
    __typename: "DepositAccountBalance" as const,
    settled: 100000 as UsdCents,
    pending: 5000 as UsdCents,
  },
  ledgerAccounts: {
    __typename: "DepositAccountLedgerAccounts" as const,
    depositAccountId: "uuid-ledger-account-1",
    frozenDepositAccountId: "uuid-frozen-ledger-account-1",
    depositAccount: createMockLedgerAccount({
      id: "ledger-account-1",
      ledgerAccountId: "uuid-ledger-account-1",
      name: "Deposit Account",
    }),
    frozenDepositAccount: createMockLedgerAccount({
      id: "frozen-ledger-account-1",
      ledgerAccountId: "uuid-frozen-ledger-account-1",
      name: "Frozen Deposit Account",
    }),
  },
  customer: createMockCustomer({
    id: "customer-1",
    customerId: "uuid-customer-1",
    publicId: "67890",
    email: "test@example.com",
    telegramId: "telegram-123",
  }),
  deposits: [],
  history: {
    __typename: "DepositAccountHistoryEntryConnection" as const,
    edges: [],
    nodes: [],
    pageInfo: {
      __typename: "PageInfo" as const,
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  },
  withdrawals: [],
})


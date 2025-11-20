import { jest } from "@jest/globals"

import type useDepositAccountsTable from '@/app/deposit-accounts/components/deposit-accounts-table/hooks/deposit-accounts-table/use-deposit-account-table'

import { createMockError } from '@/app/deposit-accounts/shared/test-utils/helpers'

type UseDepositAccountsTableReturn = ReturnType<typeof useDepositAccountsTable>
type UseDepositAccountsTableOverrides = Partial<UseDepositAccountsTableReturn>

export const createMockUseDepositAccountsTableReturn = (
  overrides?: UseDepositAccountsTableOverrides
): UseDepositAccountsTableReturn => ({
  error: undefined,
  columns: [],
  loading: false,
  paginatedData: undefined,
  handleSort: jest.fn<UseDepositAccountsTableReturn['handleSort']>(),
  fetchMoreAccounts: jest.fn<UseDepositAccountsTableReturn['fetchMoreAccounts']>(),
  navigateToAccountDetails: jest.fn<UseDepositAccountsTableReturn['navigateToAccountDetails']>(),
  ...overrides,
})

export { createMockError }



import { jest } from "@jest/globals"
import type useDepositAccountsTable from '@/app/deposit-accounts/hooks/deposit-accounts-table/use-deposit-account-table'
import { ApolloError } from '@apollo/client'

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

export const createMockError = (message: string): ApolloError =>
  new ApolloError({ errorMessage: message })



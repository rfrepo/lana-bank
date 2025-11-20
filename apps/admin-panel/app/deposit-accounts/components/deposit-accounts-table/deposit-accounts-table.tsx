"use client"
import InlineErrorText from "@/components/inline-error-text"
import { DepositAccountItem } from "@/app/deposit-accounts/types"
import PaginatedTable, { DEFAULT_PAGESIZE } from "@/components/paginated-table"
import useDepositAccountsTable from "@/app/deposit-accounts/components/deposit-accounts-table/hooks/deposit-accounts-table/use-deposit-account-table"

const DepositAccountsTable = () => {
  const {
    error,
    columns,
    loading,
    paginatedData,
    handleSort,
    fetchMoreAccounts,
    navigateToAccountDetails,
  } = useDepositAccountsTable()

  return (
    <div>
      <InlineErrorText message={error?.message} />

      <PaginatedTable<DepositAccountItem>
        loading={loading}
        columns={columns}
        onSort={handleSort}
        data={paginatedData}
        pageSize={DEFAULT_PAGESIZE}
        fetchMore={fetchMoreAccounts}
        navigateTo={navigateToAccountDetails}
        testId="deposit-account-table"
      />
    </div>
  )
}

export default DepositAccountsTable


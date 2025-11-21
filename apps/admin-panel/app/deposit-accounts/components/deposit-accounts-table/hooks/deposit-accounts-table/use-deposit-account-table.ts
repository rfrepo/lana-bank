import { useTranslations } from "next-intl"
import { useCallback, useMemo, useState } from "react"

import { DEFAULT_PAGESIZE } from "@/components/paginated-table"
import { DepositAccountItem } from "@/app/deposit-accounts/types"
import useDepositAccounts from "@/app/deposit-accounts/hooks/deposit-accounts/use-deposit-accounts"
import { getColumnsConfig } from "@/app/deposit-accounts/components/deposit-accounts-table/column-config"
import { CustomersSort, SortDirection } from "@/lib/graphql/generated"
import { camelToScreamingSnake } from "@/lib/utils"

const DEPOSIT_ACCOUNTS_ROUTE = "/deposit-accounts"

const useDepositAccountsTable = () => {
  const t = useTranslations("DepositAccounts.table")

  const [sortBy, setSortBy] = useState<CustomersSort | null>(null)

  const { data: paginatedData, loading, error, fetchMore } =
    useDepositAccounts({ first: DEFAULT_PAGESIZE, sort: sortBy })

  const columns = useMemo(() => getColumnsConfig(t), [t])

  const fetchMoreAccounts = useCallback(async (cursor: string) => {
    await fetchMore({ variables: { after: cursor } })
  }, [fetchMore])

  const handleSort = useCallback((column: keyof DepositAccountItem, sortDirection: "ASC" | "DESC") => {
    setSortBy({
      by: camelToScreamingSnake(column as string) as CustomersSort["by"],
      direction: sortDirection as SortDirection,
    })
  }, [])

  const navigateToAccountDetails = useCallback((account: DepositAccountItem) => `${DEPOSIT_ACCOUNTS_ROUTE}/${account.publicId}`,
    [],
  )

  return {
    error,
    loading,
    columns,
    handleSort,
    paginatedData,
    fetchMoreAccounts,
    navigateToAccountDetails,
  }
}

export default useDepositAccountsTable

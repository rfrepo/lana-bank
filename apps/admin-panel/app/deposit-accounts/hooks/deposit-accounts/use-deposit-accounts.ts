import { gql } from "@apollo/client"

import {
  useCustomersWithDepositAccountsQuery
} from "@/lib/graphql/generated"
import { PaginatedData } from "@/components/paginated-table"
import {
  DepositAccountNode,
  CustomerWithDepositAccountNode,
  DepositAccountItem,
  CustomerNode,
  CustomerEdge,
  DepositAccountsVariables,
} from "../../types"
import { useMemo } from "react"

gql`
  query CustomersWithDepositAccounts(
    $first: Int!
    $after: String
    $sort: CustomersSort
    $filter: CustomersFilter
  ) {
    customers(first: $first, after: $after, sort: $sort, filter: $filter) {
      edges {
        node {
          id
          customerId
          email
          depositAccount {
            __typename
            id
            depositAccountId
            publicId
            status
            balance {
              settled
              pending
            }
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

const hasDepositAccount = (customer: CustomerNode): customer is CustomerWithDepositAccountNode =>
  customer.depositAccount?.__typename === "DepositAccount"

const mapCustomerToDepositAccountItem = ({ depositAccount, email }: CustomerWithDepositAccountNode): DepositAccountItem => {
  const { id, depositAccountId, publicId, status, balance } = depositAccount as DepositAccountNode
  return { id, depositAccountId, publicId, status, balance, email }
}

const transformCustomerEdgesToDepositAccountEdges = (edges: CustomerEdge[]): Array<{ node: DepositAccountItem; cursor: string }> => edges
  .filter((edge): edge is CustomerEdge => hasDepositAccount(edge.node))
  .map(({ node, cursor }) => ({
    node: mapCustomerToDepositAccountItem(node as CustomerWithDepositAccountNode),
    cursor,
  }))

const useDepositAccounts = (variables: DepositAccountsVariables) => {
  const { data, loading, error, fetchMore } = useCustomersWithDepositAccountsQuery({ variables })

  const paginatedData: PaginatedData<DepositAccountItem> | undefined = useMemo(() => {
    if (!data?.customers?.edges?.length) return undefined

    const { edges, pageInfo } = data.customers

    const { endCursor = "", startCursor = "" } = pageInfo

    return {
      pageInfo: {
        ...pageInfo,
        endCursor: endCursor || "",
        startCursor: startCursor || ""
      },
      edges: transformCustomerEdgesToDepositAccountEdges(edges),
    }
  }, [data])

  return {
    error,
    loading,
    fetchMore,
    data: paginatedData,
  }
}

export default useDepositAccounts
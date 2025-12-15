import { gql } from "@apollo/client"

import { PAGE_INFO_FRAGMENT, DEPOSIT_ACCOUNT_BALANCE_FRAGMENT } from "@/lib/graphql/fragments"

export {
  useDepositAccountsQuery,
  DepositAccountsDocument,
  type DepositAccountsQuery,
  type DepositAccountsQueryVariables,
} from "@/lib/graphql/generated"

export type { DepositAccount } from "@/lib/graphql/generated"

gql`
  query DepositAccounts($first: Int!, $after: String) {
    depositAccounts(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          status
          publicId
          depositAccountId
          customer {
            email
            customerId
          }
          balance {
            ...DepositAccountBalanceFields
          }
        }
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
  ${DEPOSIT_ACCOUNT_BALANCE_FRAGMENT}
`

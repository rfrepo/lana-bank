import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_HISTORY_ENTRY_FRAGMENT } from "./deposit-account-history-entry-fragment"

import { PAGE_INFO_FRAGMENT } from "@/lib/graphql/fragments"

export {
    useGetDepositAccountTransactionHistoryQuery,
    GetDepositAccountTransactionHistoryDocument,
    type GetDepositAccountTransactionHistoryQuery,
    type GetDepositAccountTransactionHistoryQueryVariables,
} from "@/lib/graphql/generated"

gql`
  query GetDepositAccountTransactionHistory($publicId: PublicId!, $first: Int!, $after: String) {
    publicIdTarget(id: $publicId) {
      __typename
      ... on DepositAccount {
        history(first: $first, after: $after) {
          pageInfo {
            ...PageInfoFields
          }
          edges {
            cursor
            node {
              ...DepositAccountHistoryEntryFields
            }
          }
        }
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
  ${DEPOSIT_ACCOUNT_HISTORY_ENTRY_FRAGMENT}
`
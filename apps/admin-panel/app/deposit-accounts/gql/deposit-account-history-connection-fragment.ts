import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_HISTORY_ENTRY_FRAGMENT } from "./deposit-account-history-entry-fragment"

import { PAGE_INFO_FRAGMENT } from "@/lib/graphql/fragments/page-info"


export const DEPOSIT_ACCOUNT_HISTORY_CONNECTION_FRAGMENT = gql`
  fragment DepositAccountHistoryConnectionFields on DepositAccountHistoryEntryConnection {
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
  ${PAGE_INFO_FRAGMENT}
  ${DEPOSIT_ACCOUNT_HISTORY_ENTRY_FRAGMENT}
`


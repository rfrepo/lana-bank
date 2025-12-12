import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_LIST_FRAGMENT } from "./fragments"

import { PAGE_INFO_FRAGMENT } from "@/lib/graphql/fragments/page-info"

export const DEPOSIT_ACCOUNTS_QUERY = gql`
  query DepositAccounts($first: Int!, $after: String) {
    depositAccounts(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...DepositAccountListFields
        }
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
  ${DEPOSIT_ACCOUNT_LIST_FRAGMENT}
`
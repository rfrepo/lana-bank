import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_HISTORY_CONNECTION_FRAGMENT } from "./deposit-account-history-connection-fragment"

export const DEPOSIT_ACCOUNT_HISTORY_FRAGMENT = gql`
  fragment DepositAccountHistoryFields on DepositAccount {
    history(first: $first, after: $after) {
      ...DepositAccountHistoryConnectionFields
    }
  }
  ${DEPOSIT_ACCOUNT_HISTORY_CONNECTION_FRAGMENT}
`

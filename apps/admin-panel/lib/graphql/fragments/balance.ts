import { gql } from "@apollo/client"

export const DEPOSIT_ACCOUNT_BALANCE_FRAGMENT = gql`
  fragment DepositAccountBalanceFields on DepositAccountBalance {
    settled
    pending
  }
`

import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_BALANCE_FRAGMENT } from "@/lib/graphql/fragments/balance"

export const DEPOSIT_ACCOUNT_LIST_FRAGMENT = gql`
  fragment DepositAccountListFields on DepositAccount {
    id
    status
    publicId
    customer {
      email
      customerId
    }
    depositAccountId
    balance {
      ...DepositAccountBalanceFields
    }
  }
  ${DEPOSIT_ACCOUNT_BALANCE_FRAGMENT}
`
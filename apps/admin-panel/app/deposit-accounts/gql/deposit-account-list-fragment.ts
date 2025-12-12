import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_BALANCE_FRAGMENT } from "@/lib/graphql/fragments/balance"

export const DEPOSIT_ACCOUNT_LIST_FRAGMENT = gql`
  fragment DepositAccountFields on DepositAccount {
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
  ${DEPOSIT_ACCOUNT_BALANCE_FRAGMENT}
`

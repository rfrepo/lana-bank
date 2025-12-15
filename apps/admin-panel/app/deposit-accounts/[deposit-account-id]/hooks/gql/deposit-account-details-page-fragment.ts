import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_BALANCE_FRAGMENT } from "@/lib/graphql/fragments/balance"

export const DEPOSIT_ACCOUNT_DETAILS_PAGE_FRAGMENT = gql`
  fragment DepositAccountDetailsPageFragment on DepositAccount {
    id
    status
    publicId
    depositAccountId
    customer {
      id
      email
      activity
      publicId
      createdAt
      customerId
      telegramId
      customerType
    }
    ledgerAccounts {
      depositAccountId
      frozenDepositAccountId
    }
    balance {
      ...DepositAccountBalanceFields
    }
  }
  ${DEPOSIT_ACCOUNT_BALANCE_FRAGMENT}
`

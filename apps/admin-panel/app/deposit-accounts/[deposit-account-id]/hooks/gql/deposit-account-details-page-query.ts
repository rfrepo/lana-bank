import { gql } from "@apollo/client"

import { DEPOSIT_ACCOUNT_BALANCE_FRAGMENT } from "@/lib/graphql/fragments"

export {
    useGetDepositAccountDetailsPageQuery,
    GetDepositAccountDetailsPageDocument,
    type GetDepositAccountDetailsPageQuery,
    type GetDepositAccountDetailsPageQueryVariables,
} from "@/lib/graphql/generated"

gql`
  query GetDepositAccountDetailsPage($publicId: PublicId!) {
    publicIdTarget(id: $publicId) {
      __typename
      ... on DepositAccount {
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
    }
  }
  ${DEPOSIT_ACCOUNT_BALANCE_FRAGMENT}
`

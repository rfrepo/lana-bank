import { gql } from "@apollo/client"

import {
  useGetDepositAccountByPublicIdQuery,
  GetDepositAccountByPublicIdQuery,
} from "@/lib/graphql/generated"

gql`
  fragment DepositAccountDetailsFragment on DepositAccount {
    id
    depositAccountId
    customerId
    createdAt
    status
    publicId
    balance {
      settled
      pending
    }
    ledgerAccounts {
      depositAccountId
      frozenDepositAccountId
    }
    customer {
      id
      customerId
      publicId
      email
      telegramId
    }
  }

  query GetDepositAccountByPublicId($publicId: PublicId!) {
    publicIdTarget(id: $publicId) {
      __typename
      ... on DepositAccount {
        ...DepositAccountDetailsFragment
      }
    }
  }
`

export type DepositAccountData = NonNullable<
  Extract<
    NonNullable<GetDepositAccountByPublicIdQuery["publicIdTarget"]>,
    { __typename: "DepositAccount" }
  >
>

export function useDepositAccount(publicId: string) {
  const { data, loading, error } = useGetDepositAccountByPublicIdQuery({
    variables: { publicId },
    skip: !publicId,
    errorPolicy: "all",
  })

  const depositAccount =
    data?.publicIdTarget?.__typename === "DepositAccount"
      ? data.publicIdTarget
      : null

  return {
    depositAccount,
    loading,
    error,
    notFound: !loading && !error && !depositAccount,
  }
}


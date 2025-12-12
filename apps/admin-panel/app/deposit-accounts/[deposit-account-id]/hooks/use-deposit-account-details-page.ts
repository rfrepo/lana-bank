"use client"

import { gql } from "@apollo/client"

import {
  useGetDepositAccountDetailsPageQuery,
  GetDepositAccountDetailsPageQuery,
  GetDepositAccountDetailsPageQueryVariables,
} from "@/lib/graphql/generated"

import { DEPOSIT_ACCOUNT_DETAILS_PAGE_FRAGMENT } from "@/app/deposit-accounts/gql/fragments"

gql`
  query GetDepositAccountDetailsPage($publicId: PublicId!) {
    publicIdTarget(id: $publicId) {
      __typename
      ... on DepositAccount {
        ...DepositAccountDetailsPageFragment
      }
    }
  }
  ${DEPOSIT_ACCOUNT_DETAILS_PAGE_FRAGMENT}
`

type DepositAccountData = NonNullable<
  Extract<
    NonNullable<GetDepositAccountDetailsPageQuery["publicIdTarget"]>,
    { __typename: "DepositAccount" }
  >
>

export function useDepositAccountDetailsPage(publicId: string) {
  const { data, loading, error } = useGetDepositAccountDetailsPageQuery({
    variables: { publicId } as GetDepositAccountDetailsPageQueryVariables,
  })

  const depositAccount =
    data?.publicIdTarget?.__typename === "DepositAccount"
      ? (data.publicIdTarget as DepositAccountData)
      : null

  return {
    data,
    error,
    loading,
    depositAccount,
  }
}

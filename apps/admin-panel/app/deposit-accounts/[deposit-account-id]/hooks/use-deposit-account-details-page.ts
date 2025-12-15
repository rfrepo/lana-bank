"use client"

import { useGetDepositAccountDetailsPageQuery } from "./gql/deposit-account-details-page-query"

import {
  GetDepositAccountDetailsPageQuery,
  GetDepositAccountDetailsPageQueryVariables,
} from "@/lib/graphql/generated"

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

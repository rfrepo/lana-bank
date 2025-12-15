"use client"

import {
  GetDepositAccountDetailsPageQuery,
  GetDepositAccountDetailsPageQueryVariables,
} from "@/lib/graphql/generated"

import { useGetDepositAccountDetailsPageQuery } from "@/app/deposit-accounts/[deposit-account-id]/hooks/gql/deposite-account-details-page-query" 
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

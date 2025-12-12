"use client"

import { gql } from "@apollo/client"

import {
  useDepositAccountFreezeMutation,
  GetDepositAccountDetailsPageDocument,
} from "@/lib/graphql/generated"


gql`
  mutation DepositAccountFreeze($input: DepositAccountFreezeInput!) {
    depositAccountFreeze(input: $input) {
      account {
        id
        depositAccountId
      }
    }
  }
`
export function useFreezeDepositAccount() {
  const [freezeDepositAccount, { loading, reset }] = useDepositAccountFreezeMutation({
    refetchQueries: [GetDepositAccountDetailsPageDocument],
  })

  return {
    reset,
    loading,
    freezeDepositAccount,
  }
}

"use client"

import { gql } from "@apollo/client"

import {
  useDepositAccountUnfreezeMutation,
  GetDepositAccountDetailsPageDocument,
} from "@/lib/graphql/generated"

gql`
  mutation DepositAccountUnfreeze($input: DepositAccountUnfreezeInput!) {
    depositAccountUnfreeze(input: $input) {
      account {
        id
        depositAccountId
      }
    }
  }
`
export function useUnfreezeDepositAccount() {
  const [unfreezeDepositAccount, { loading, reset }] = useDepositAccountUnfreezeMutation({
    refetchQueries: [GetDepositAccountDetailsPageDocument],
  })

  return {
    unfreezeDepositAccount,
    loading,
    reset,
  }
}


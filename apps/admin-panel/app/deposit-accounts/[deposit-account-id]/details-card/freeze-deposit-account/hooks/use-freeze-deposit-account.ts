"use client"

import { useDepositAccountFreezeMutation, GetDepositAccountDetailsPageDocument } from "./gql/deposit-account-freeze-mutation"

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

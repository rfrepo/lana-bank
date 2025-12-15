"use client"

import { GetDepositAccountDetailsPageDocument, useDepositAccountUnfreezeMutation } from "@/app/deposit-accounts/[deposit-account-id]/details-card/unfreeze-deposit-account/hooks/gql/deposit-account-unfreeze-mutation"

export function useUnfreezeDepositAccount() {
  const [unfreezeDepositAccount, { loading, reset }] = useDepositAccountUnfreezeMutation({
    refetchQueries: [GetDepositAccountDetailsPageDocument],
  })

  return {
    reset,
    loading,
    unfreezeDepositAccount,
  }
}

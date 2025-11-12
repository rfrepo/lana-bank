import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DepositAccountStatus } from "@/lib/graphql/generated"
import { DepositAccountData } from "../deposit-account/use-deposit-account"

export interface UseDepositAccountActionsProps {
  status: DepositAccountStatus
  ledgerAccounts: DepositAccountData["ledgerAccounts"]
}

export interface UseDepositAccountActionsReturn {
  openFreezeDialog: boolean
  openUnfreezeDialog: boolean
  handleFreezeAccount: () => void
  handleUnfreezeAccount: () => void
  handleViewLedgerAccount: () => void
  setOpenFreezeDialog: (isOpen: boolean) => void
  setOpenUnfreezeDialog: (isOpen: boolean) => void
}

/**
 * Hook for managing deposit account actions including freeze/unfreeze dialogs
 * and ledger account navigation.
 *
 * @param status - The current status of the deposit account
 * @param ledgerAccounts - The ledger accounts associated with the deposit account
 * @returns Object containing dialog state and action handlers
 */
export function useDepositAccountActions({
  status,
  ledgerAccounts,
}: UseDepositAccountActionsProps): UseDepositAccountActionsReturn {
  const router = useRouter()
  const [openFreezeDialog, setOpenFreezeDialog] = useState(false)
  const [openUnfreezeDialog, setOpenUnfreezeDialog] = useState(false)

  const handleViewLedgerAccount = useCallback(() => {
    const accountId =
      status === DepositAccountStatus.Frozen
        ? ledgerAccounts?.frozenDepositAccountId
        : ledgerAccounts?.depositAccountId

    if (accountId) {
      router.push(`/ledger-accounts/${accountId}`)
    }
  }, [status, ledgerAccounts, router])

  const handleFreezeAccount = useCallback(() => {
    setOpenFreezeDialog(true)
  }, [])

  const handleUnfreezeAccount = useCallback(() => {
    setOpenUnfreezeDialog(true)
  }, [])

  return {
    openFreezeDialog,
    openUnfreezeDialog,
    handleFreezeAccount,
    handleUnfreezeAccount,
    handleViewLedgerAccount,
    setOpenFreezeDialog,
    setOpenUnfreezeDialog,
  }
}


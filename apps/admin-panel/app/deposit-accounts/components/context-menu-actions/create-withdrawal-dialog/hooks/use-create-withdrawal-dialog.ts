import {
  DEPOSIT_ACCOUNT_ACTION_IDS,
  type DepositAccountActionId,
} from "../../types"

import {
  useContextMenuData,
  useContextMenuSelectedAction,
  useClearContextMenuSelectedAction,
} from "@/components/context-menu-actions/store/context-menu-actions-store"
import { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"

export function useCreateWithdrawalDialog() {
  const accountContext = useContextMenuData<DepositAccountData>()
  const selectedAction = useContextMenuSelectedAction<DepositAccountActionId>()
  const clearAction = useClearContextMenuSelectedAction()
  const currentActionId = selectedAction?.actionId ?? null

  const open = currentActionId === DEPOSIT_ACCOUNT_ACTION_IDS.CREATE_WITHDRAWAL
  const depositAccountId = accountContext?.depositAccountId || ""
  const customerEmail = accountContext?.customer?.email

  return {
    open,
    depositAccountId,
    customerEmail,
    clearAction,
  }
}


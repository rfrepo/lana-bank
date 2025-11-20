import { useTranslations } from "next-intl"

import { DepositAccountActionId } from "../../types"

import { getContextMenuItemsConfig } from "../../deposit-account-context-menu/deposite-account-context-menu-items-config"

import { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"

import { useSetupContextMenuActions } from "@/components/context-menu-actions/hooks/setup-context-menu-actions/use-setup-context-menu-actions"
import { useContextMenuData } from "@/components/context-menu-actions/store/context-menu-actions-store"


const useDepositAccountContextMenuActions = () => {
    const configs = getContextMenuItemsConfig()
    const contextData = useContextMenuData<DepositAccountData>()
    const buttonLabel = useTranslations("CreateButton.buttons")("create") as string

    useSetupContextMenuActions<DepositAccountData, DepositAccountActionId>({
        configs,
        contextData,
        buttonLabel,
    })
}

export default useDepositAccountContextMenuActions
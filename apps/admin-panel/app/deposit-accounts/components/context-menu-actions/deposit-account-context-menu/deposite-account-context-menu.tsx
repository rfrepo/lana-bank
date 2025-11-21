"use client"

import useDepositAccountContextMenuActions from "../hooks/deposite-account-context-menu-actions/use-deposite-account-context-menu-actions"
import { CreateDepositDialog } from "../create-deposit-dialog/create-deposit-dialog"
import { CreateWithdrawalDialog } from "../create-withdrawal-dialog/create-withdrawal-dialog"

const DepositAccountContextActionMenu = (): React.ReactNode => {
    useDepositAccountContextMenuActions()

    return (
        <>
            <CreateDepositDialog />
            <CreateWithdrawalDialog />
        </>
    )
}

export default DepositAccountContextActionMenu


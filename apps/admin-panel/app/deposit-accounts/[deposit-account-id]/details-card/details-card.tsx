"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Snowflake, ArrowRight, Sun } from "lucide-react"

import { Button } from "@lana/web/ui/button"

import FreezeDepositAccountDialog from "@/app/deposit-accounts/[deposit-account-id]/details-card/freeze-deposit-account/freeze-deposit-account"
import UnfreezeDepositAccountDialog from "@/app/deposit-accounts/[deposit-account-id]/details-card/unfreeze-deposit-account/unfreeze-deposit-account"

import { DetailsCard } from "@/components/details"
import {
  DepositAccountStatus,
  GetDepositAccountDetailsPageQuery,
} from "@/lib/graphql/generated"
import { useDepositAccountDetailItems } from "@/hooks/deposit-account/use-deposit-account-detail-items"

type DepositAccountData = NonNullable<
  Extract<
    NonNullable<GetDepositAccountDetailsPageQuery["publicIdTarget"]>,
    { __typename: "DepositAccount" }
  >
>

type DepositAccountDetailsProps = {
  depositAccount: DepositAccountData
}

const DepositAccountDetailsCard: React.FC<DepositAccountDetailsProps> = ({
  depositAccount: { balance, status, depositAccountId, ledgerAccounts },
}) => {
  const router = useRouter()
  const [openFreezeDialog, setOpenFreezeDialog] = useState(false)
  const t = useTranslations("DepositAccounts.DepositAccountDetails")
  const [openUnfreezeDialog, setOpenUnfreezeDialog] = useState(false)

  const handleViewLedgerAccount = () => {
    const accountId =
      status === DepositAccountStatus.Frozen
        ? ledgerAccounts?.frozenDepositAccountId
        : ledgerAccounts?.depositAccountId

    if (accountId) router.push(`/ledger-accounts/${accountId}`)
  }

  const handleFreezeAccount = () => {
    setOpenFreezeDialog(true)
  }

  const handleUnfreezeAccount = () => {
    setOpenUnfreezeDialog(true)
  }

  const details = useDepositAccountDetailItems({
    status,
    balance,
    translationKey: "DepositAccounts.DepositAccountDetails",
  })

  return (
    <>
      <DetailsCard
        title={t("title")}
        details={details}
        columns={3}
        className="w-full"
        footerContent={
          <>
            <Button variant="outline" onClick={handleViewLedgerAccount}>
              {t("buttons.viewLedgerAccount")}
              <ArrowRight />
            </Button>
            {status === DepositAccountStatus.Frozen && (
              <Button variant="outline" onClick={handleUnfreezeAccount}>
                <Sun />
                {t("buttons.unfreezeDepositAccount")}
              </Button>
            )}
            {status === DepositAccountStatus.Active && (
              <Button variant="outline" onClick={handleFreezeAccount}>
                <Snowflake />
                {t("buttons.freezeDepositAccount")}
              </Button>
            )}
          </>
        }
      />
      <FreezeDepositAccountDialog
        balance={balance}
        depositAccountId={depositAccountId}
        openFreezeDialog={openFreezeDialog}
        setOpenFreezeDialog={setOpenFreezeDialog}
      />
      <UnfreezeDepositAccountDialog
        depositAccountId={depositAccountId}
        openUnfreezeDialog={openUnfreezeDialog}
        setOpenUnfreezeDialog={setOpenUnfreezeDialog}
      />
    </>
  )
}

export default DepositAccountDetailsCard


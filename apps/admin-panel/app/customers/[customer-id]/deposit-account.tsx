"use client"

import React from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@lana/web/ui/button"

import { DetailsCard } from "@/components/details"
import {
  DepositAccountStatus,
  GetCustomerBasicDetailsQuery,
} from "@/lib/graphql/generated"
import { useDepositAccountDetailItems } from "@/hooks/deposit-account/use-deposit-account-detail-items"

type DepositAccountProps = {
  balance: NonNullable<
    NonNullable<GetCustomerBasicDetailsQuery["customerByPublicId"]>["depositAccount"]
  >["balance"]
  publicId: string
  status: DepositAccountStatus
}

export const DepositAccount: React.FC<DepositAccountProps> = ({
  balance,
  publicId,
  status,
}) => {
  const t = useTranslations("Customers.CustomerDetails.depositAccount")
  const details = useDepositAccountDetailItems({
    balance,
    status,
    translationKey: "Customers.CustomerDetails.depositAccount",
  })

  return (
    <DetailsCard
      title={t("title")}
      details={details}
      columns={3}
      className="w-full md:w-3/4"
      publicId={publicId}
      footerContent={
        <Button variant="outline" asChild>
          <Link href={`/deposit-accounts/${publicId}`}>
            {t("buttons.viewAccount")}
            <ArrowRight />
          </Link>
        </Button>
      }
    />
  )
}

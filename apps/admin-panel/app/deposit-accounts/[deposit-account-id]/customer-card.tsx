"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

import { Button } from "@lana/web/ui/button"

import { formatDate } from "@lana/web/utils"

import { Badge } from "@lana/web/ui/badge"

import { DetailsCard, DetailItemProps } from "@/components/details"
import {
  Activity,
  CustomerType,
  GetDepositAccountDetailsPageQuery,
} from "@/lib/graphql/generated"

type CustomerCardProps = {
  customer: DepositAccountData["customer"]
}

type DepositAccountData = NonNullable<
  Extract<
    NonNullable<GetDepositAccountDetailsPageQuery["publicIdTarget"]>,
    { __typename: "DepositAccount" }
  >
>

const customerTypeTranslationKeys = {
  [CustomerType.Bank]: "fields.customerType.bank",
  [CustomerType.Individual]: "fields.customerType.individual",
  [CustomerType.PrivateCompany]: "fields.customerType.privateCompany",
  [CustomerType.GovernmentEntity]: "fields.customerType.governmentEntity",
  [CustomerType.NonDomiciledCompany]: "fields.customerType.nonDomiciledCompany",
  [CustomerType.ForeignAgencyOrSubsidiary]: "fields.customerType.foreignAgency",
  [CustomerType.FinancialInstitution]: "fields.customerType.financialInstitution",
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer: { email, customerType, activity, createdAt, publicId } }) => {
  const isActive = activity === Activity.Active;
  const t = useTranslations("DepositAccounts.CustomerCard")
  const customerTypeTranslationKey = customerTypeTranslationKeys[customerType] || String(customerType)

  const activityBadgeVariant = isActive ? "success" : activity === Activity.Inactive
    ? "secondary" : "destructive"

  const activityBadgeTranslationKey = isActive ? "active" : activity === Activity.Inactive
    ? "inactive" : "suspended"

  const details: DetailItemProps[] = [
    {
      value: email,
      label: t("fields.email"),
    },
    {
      value: t(customerTypeTranslationKey),
      label: t("fields.customerTypeLabel"),
    },
    {
      label: t("fields.activityLabel"),
      value: (
        <Badge variant={activityBadgeVariant}>
          {t(`fields.activity.${activityBadgeTranslationKey}`)}
        </Badge>
      ),
    },
    {
      label: t("fields.createdAt"),
      value: formatDate(createdAt),
    },
  ]

  const footerContent = (
    <Button asChild variant="outline">
      <a href={`/customers/${publicId}`}>
        {t("buttons.viewCustomer")}
        <ArrowRight />
      </a>
    </Button>
  )

  return (
    <DetailsCard
      columns={4}
      details={details}
      title={t("title")}
      className="w-full "
      footerContent={footerContent}
    />
  )
}

export default CustomerCard

"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { Badge, type BadgeProps } from "@lana/web/ui/badge"

import { DepositAccountStatus } from "@/lib/graphql/generated"

const accountStatusMap = {
  [DepositAccountStatus.Active]: "success",
  [DepositAccountStatus.Frozen]: "destructive",
  [DepositAccountStatus.Inactive]: "secondary",
} satisfies Record<DepositAccountStatus, BadgeProps["variant"]>

export const DepositAccountStatusBadge: React.FC<{ status: DepositAccountStatus }> = ({
  status,
}) => {
  const t = useTranslations("DepositAccounts.DepositAccountStatus")

  return <Badge variant={accountStatusMap[status] ?? "default"}>{t(status.toLowerCase())}</Badge>
}

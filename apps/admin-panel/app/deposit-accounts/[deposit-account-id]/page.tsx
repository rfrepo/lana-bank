"use client"

import { use, useEffect } from "react"



import DepositAccountDetailsCard from "./details-card/details-card"
import CustomerCard from "./customer-card"
import { useDepositAccountBreadcrumb } from "./hooks/use-deposit-account-breadcrumb"
import { DepositAccountTransactionHistoryTable } from "./transaction-history-table/transaction-history-table"

import { useDepositAccountDetailsPage } from "./hooks/use-deposit-account-details-page"
import { ErrorState } from "./page-states/error-state"
import { NotFoundState } from "./page-states/not-found-state"

import { useCreateContext } from "@/app/create"
import { DetailsPageSkeleton } from "@/components/details-page-skeleton"
import { Customer } from "@/lib/graphql/generated"

function DepositAccountPage({
  params,
}: {
  params: Promise<{
    "deposit-account-id": string
  }>
}) {
  const { "deposit-account-id": publicId } = use(params)

  const { data, loading, error, depositAccount } =
    useDepositAccountDetailsPage(publicId)

  useDepositAccountBreadcrumb(depositAccount)

  const { setDepositAccount, setCustomer } = useCreateContext()

  useEffect(() => {
    if (depositAccount) {
      setDepositAccount(depositAccount)
      if (depositAccount.customer) {
        setCustomer(depositAccount.customer as Customer)
      }
    }
    return () => {
      setDepositAccount(null)
      setCustomer(null)
    }
  }, [depositAccount, setDepositAccount, setCustomer])

  if (loading && !data) {
    return <DetailsPageSkeleton tabs={0} detailItems={3} tabsCards={0} />
  }

  if (error) {
    return <ErrorState />
  }

  if (!depositAccount) {
    return <NotFoundState />
  }

  return (
    <main className="max-w-7xl m-auto space-y-2">
      <CustomerCard customer={depositAccount.customer} />
      <DepositAccountDetailsCard depositAccount={depositAccount} />
      <DepositAccountTransactionHistoryTable publicId={publicId} />
    </main>
  )
}

export default DepositAccountPage


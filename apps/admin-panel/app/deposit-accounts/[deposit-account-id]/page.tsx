"use client"
import DepositAccountContextActionMenu from "../components/context-menu-actions/deposit-account-context-menu/deposite-account-context-menu"

import NoDepositAccount from "./components/account-not-found/no-deposit-account"
import DepositAccountDetails from "./components/account-overview/deposit-account-details"
import DepositAccountPageLoadError from "./components/page-load-error/deposit-account-page-load-error"
import CustomerCard from "./components/associated-customer-card/customer-card"
import { DepositAccountTransactions } from "./components/transaction-history/deposit-account-transactions"

import { useDepositAccountPage } from "./hooks/deposit-account-page/use-deposit-account-page"

import { DetailsPageSkeleton } from "@/components/details-page-skeleton"

function DepositAccountPage({
  params,
}: {
  params: Promise<{
    "deposit-account-id": string
  }>
}) {
  const { depositAccount, loading, error, notFound } = useDepositAccountPage(params)

  if (loading && !depositAccount) {
    return <DetailsPageSkeleton tabs={0} detailItems={3} tabsCards={0} />
  }

  if (error) {
    return <DepositAccountPageLoadError error={error} />
  }

  if (notFound || !depositAccount) {
    return <NoDepositAccount />
  }

  return (
    <main className="max-w-7xl m-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        <DepositAccountDetails depositAccount={depositAccount} />
        <CustomerCard customer={depositAccount.customer} />
      </div>
      <DepositAccountTransactions depositAccountId={depositAccount.publicId} />
      <DepositAccountContextActionMenu />
    </main>
  )
}

export default DepositAccountPage

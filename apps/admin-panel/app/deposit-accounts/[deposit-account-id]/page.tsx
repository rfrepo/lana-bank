"use client"
import { DetailsPageSkeleton } from "@/components/details-page-skeleton"
import NoDepositAccount from "./components/no-deposit-account/no-deposit-account"
import DepositAccountDetails from "./components/deposit-account-details/deposit-account-details"
import DepositAccountPageLoadError from "./components/deposit-account-page-load-error/deposit-account-page-load-error"
import { useDepositAccountPage } from "@/app/deposit-accounts/[deposit-account-id]/hooks/deposit-account-page/use-deposit-account-page"

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
    <main className="max-w-7xl m-auto space-y-2">
      <DepositAccountDetails depositAccount={depositAccount} />
    </main>
  )
}

export default DepositAccountPage

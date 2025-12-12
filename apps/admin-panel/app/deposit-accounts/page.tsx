"use client"

import DepositAccountsList from "./list/list"

import PageCard from "@/components/page-card"

const DepositAccountsPage: React.FC = () => {
  return (
    <PageCard translationKey="DepositAccounts">
      <DepositAccountsList />
    </PageCard>
  )
}

export default DepositAccountsPage
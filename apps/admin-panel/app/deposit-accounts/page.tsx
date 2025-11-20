"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@lana/web/ui/card"

import { useTranslationRecord } from "@/hooks/translation-record/use-translation-record"
import DepositAccountsTable from "@/app/deposit-accounts/components/deposit-accounts-table/deposit-accounts-table"

const DepositAccountsPage: React.FC = () => {
  const [title, description] = useTranslationRecord("DepositAccounts", ["title", "description"])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>

          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <DepositAccountsTable />
        </CardContent>
      </Card>
    </>
  )
}

export default DepositAccountsPage
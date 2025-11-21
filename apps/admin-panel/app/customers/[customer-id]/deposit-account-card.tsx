"use client"

import Link from "next/link"
import { HiArrowRight } from "react-icons/hi"
import { useTranslations } from "next-intl"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@lana/web/ui/card"
import { Button } from "@lana/web/ui/button"

import Balance from "@/components/balance/balance"
import { DepositAccountStatusBadge } from "@/app/deposit-accounts/[deposit-account-id]/components/account-overview/deposit-account-details"
import type { GetCustomerBasicDetailsQuery } from "@/lib/graphql/generated"

type DepositAccountCardProps = {
    depositAccount: NonNullable<GetCustomerBasicDetailsQuery["customerByPublicId"]>["depositAccount"]
}

const DepositAccountCard: React.FC<DepositAccountCardProps> = ({ depositAccount }) => {
    const t = useTranslations("Customers.CustomerDetails.depositAccountCard")

    if (!depositAccount) {
        return null
    }

    return (
        <Card className="w-full md:w-1/2 py-3">
            <CardHeader className="py-0 my-0 mb-3">
                <CardTitle className="text-md font-semibold">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="py-1 my-0">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {t("labels.status")}:
                            </span>
                            <DepositAccountStatusBadge status={depositAccount.status} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {t("labels.balance")}:
                            </span>
                            <Balance amount={depositAccount.balance.settled} currency="usd" />
                        </div>
                    </div>
                    <div>
                        <Link href={`/deposit-accounts/${depositAccount.publicId}`}>
                            <Button variant="outline">
                                {t("buttonText")}
                                <HiArrowRight />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DepositAccountCard


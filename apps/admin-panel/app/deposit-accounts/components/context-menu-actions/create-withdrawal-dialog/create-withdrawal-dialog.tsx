"use client"

import React from "react"
import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@lana/web/ui/dialog"
import { Input } from "@lana/web/ui/input"
import { Button } from "@lana/web/ui/button"
import { Label } from "@lana/web/ui/label"

import { useCreateWithdrawal } from "./hooks/use-create-withdrawal"
import { useCreateWithdrawalDialog } from "./hooks/use-create-withdrawal-dialog"

/**
 * Reusable dialog component for creating a withdrawal
 * Listens to dialog provider to know when to show itself
 */
export function CreateWithdrawalDialog() {
  const { open, depositAccountId, customerEmail, clearAction } =
    useCreateWithdrawalDialog()
  const t = useTranslations("Withdrawals.WithdrawalInitiateDialog")

  const {
    amount,
    reference,
    error,
    loading,
    setAmount,
    setReference,
    handleSubmit,
    reset,
  } = useCreateWithdrawal({
    depositAccountId,
    onSuccess: () => {
      clearAction()
      reset()
    },
  })

  const handleCloseDialog = (isOpen: boolean) => {
    if (!isOpen) {
      clearAction()
      reset()
    }
  }

  return (
    <Dialog open={open && !!depositAccountId} onOpenChange={handleCloseDialog}>
      <DialogContent>
        {customerEmail && (
          <div
            className="absolute -top-6 -left-[1px] bg-primary rounded-tl-md rounded-tr-md text-md px-2 py-1 text-secondary"
            style={{ width: "100.35%" }}
          >
            {t("creatingFor", { email: customerEmail })}
          </div>
        )}
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="amount">{t("fields.amount")}</Label>
            <div className="flex items-center gap-1">
              <Input
                data-testid="withdraw-amount-input"
                id="amount"
                type="number"
                required
                placeholder={t("placeholders.amount")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
              <div className="p-1.5 bg-input-text rounded-md px-4">USD</div>
            </div>
          </div>
          <div>
            <Label htmlFor="reference">{t("fields.reference")}</Label>
            <Input
              id="reference"
              type="text"
              placeholder={t("placeholders.reference")}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="submit"
              loading={loading}
              data-testid="withdraw-submit-button"
            >
              {loading ? t("buttons.processing") : t("buttons.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


import { t } from "../translation"

const waitForLoad = () => {
    cy.get('[data-testid="loading-skeleton"]', { timeout: 30000 }).should("not.exist")
    cy.get('[data-testid="global-loader"]', { timeout: 30000 }).should("not.exist")
}

export const visitDepositAccountPage = (depositAccountPublicId: string) => {
    cy.visit(`/deposit-accounts/${depositAccountPublicId}`)
    waitForLoad()
}

export const clickCustomerCardButton = () => {
    cy.contains("button", t("DepositAccounts.CustomerCard.buttonText"), { timeout: 10000 }).click()
}

export const verifyDepositAccountPageLoaded = () => {
    waitForLoad()
    cy.contains(t("DepositAccounts.DepositAccountDetails.title"), { timeout: 10000 }).should("be.visible")
}

export const openCreateMenu = () => {
    cy.get('[data-testid="global-create-button"]', { timeout: 10000 }).should("be.visible").click()
}

export const clickCreateDepositOption = () => {
    cy.get('[data-testid="create-deposit-button"]', { timeout: 10000 }).should("be.visible").click()
}

export const clickCreateWithdrawalOption = () => {
    cy.get('[data-testid="create-withdrawal-button"]', { timeout: 10000 }).should("be.visible").click()
}

export const verifyDepositDialogOpen = () => {
    cy.get('[data-testid="deposit-amount-input"]', { timeout: 10000 }).should("be.visible")
}

export const verifyWithdrawalDialogOpen = () => {
    cy.get('[data-testid="withdraw-amount-input"]', { timeout: 10000 }).should("be.visible")
}

export const closeDialog = () => {
    cy.get("body").type("{esc}")
}


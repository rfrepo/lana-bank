import { t } from "../translation"

const waitForLoad = () => {
    cy.get('[data-testid="loading-skeleton"]', { timeout: 30000 }).should("not.exist")
    cy.get('[data-testid="global-loader"]', { timeout: 30000 }).should("not.exist")
}

export const visitCustomerPage = (customerPublicId: string) => {
    cy.visit(`/customers/${customerPublicId}`)
    waitForLoad()
}

export const clickDepositAccountCardButton = () => {
    cy.contains("button", t("Customers.CustomerDetails.depositAccountCard.buttonText"), {
        timeout: 10000,
    }).click()
}

export const verifyCustomerPageLoaded = () => {
    waitForLoad()
    cy.contains(t("Customers.CustomerDetails.details.title"), { timeout: 10000 }).should("be.visible")
}


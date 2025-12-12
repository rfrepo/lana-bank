import { t } from "../support/translation"

const TIMEOUT = 10000
const DEPOSIT_ACCOUNTS_URL = "/deposit-accounts"

const T_DEPOSIT_ACCOUNTS_TITLE = "DepositAccounts.title"
const T_SIDEBAR_DASHBOARD = "Sidebar.navItems.dashboard"
const T_CUSTOMER_CARD_TITLE = "DepositAccounts.CustomerCard.title"
const T_DEPOSIT_ACCOUNTS_DESCRIPTION = "DepositAccounts.description"
const T_SIDEBAR_DEPOSIT_ACCOUNTS = "Sidebar.navItems.depositAccounts"
const T_NOT_FOUND = "DepositAccounts.DepositAccountDetails.errors.notFound"
const T_DEPOSIT_ACCOUNT_DETAILS_TITLE = "DepositAccounts.DepositAccountDetails.title"
const T_VIEW_CUSTOMER = "DepositAccounts.CustomerCard.buttons.viewCustomer"

const $SIDEBAR_MENU_BUTTON = '[data-sidebar="menu-button"]'
const $DEPOSIT_ACCOUNT_TABLE = '[data-testid="deposit-account-table"]'

describe("Deposit Accounts", () => {
    it("should navigate to deposit accounts page from sidebar", () => {
        cy.visit("/dashboard")
        cy.takeScreenshot("dashboard_page")

        cy.assertTranslationElementShouldBeVisible(T_SIDEBAR_DASHBOARD)
        cy.clickTranslatedElement(T_SIDEBAR_DEPOSIT_ACCOUNTS)

        cy.url().should("include", DEPOSIT_ACCOUNTS_URL)
        cy.takeScreenshot("navigated_to_deposit_accounts")

        cy.assertTranslationElementShouldBeVisible(T_DEPOSIT_ACCOUNTS_TITLE)
        cy.assertTranslationElementShouldBeVisible(T_DEPOSIT_ACCOUNTS_DESCRIPTION)

        cy.get($DEPOSIT_ACCOUNT_TABLE, { timeout: TIMEOUT }).should("be.visible")
    })

    it("should highlight deposit accounts in sidebar when on deposit accounts page", () => {
        cy.visit(DEPOSIT_ACCOUNTS_URL)
        cy.takeScreenshot("deposit_accounts_page_loaded")

        cy.findTranslatedElement(T_SIDEBAR_DEPOSIT_ACCOUNTS)
            .closest($SIDEBAR_MENU_BUTTON)
            .should("have.attr", "data-active", "true")

        cy.takeScreenshot("sidebar_item_active")
    })

    it("should navigate to deposit account details page from listing", () => {
        cy.visit(DEPOSIT_ACCOUNTS_URL)
        cy.get($DEPOSIT_ACCOUNT_TABLE, { timeout: TIMEOUT }).should("be.visible")
        cy.takeScreenshot("deposit_accounts_list_loaded")

        cy.get('[data-testid="table-row-0"]').within(() => {
            cy.get('a').first().click()
        })
        cy.takeScreenshot("clicked_on_deposit_account_row")

        cy.url({ timeout: TIMEOUT * 2 }).should("match", /\/deposit-accounts\/\d+$/)
        cy.assertTranslationElementShouldBeVisible(T_DEPOSIT_ACCOUNT_DETAILS_TITLE)
        cy.assertTranslationElementShouldBeVisible(T_CUSTOMER_CARD_TITLE)
        cy.takeScreenshot("deposit_account_details_page")
    })

    it("should handle 404 for invalid deposit account ID", () => {
        cy.visit("/deposit-accounts/invalid-id-12345")
        cy.takeScreenshot("invalid_deposit_account_id")

        cy.assertTranslationElementShouldBeVisible(T_NOT_FOUND)
        cy.contains(t(T_NOT_FOUND)).should("be.visible")
        cy.takeScreenshot("deposit_account_not_found_page")
    })

    it("should navigate to customer page from customer card", () => {
        cy.visit(DEPOSIT_ACCOUNTS_URL)
        cy.get($DEPOSIT_ACCOUNT_TABLE, { timeout: TIMEOUT }).should("be.visible")
        cy.get('[data-testid="table-row-0"]').within(() => {
            cy.get('a').first().click()
        })

        cy.url({ timeout: TIMEOUT * 2 }).should("match", /\/deposit-accounts\/\d+$/)
        cy.assertTranslationElementShouldBeVisible(T_CUSTOMER_CARD_TITLE)
        cy.takeScreenshot("deposit_account_details_with_customer_card")

        cy.findTranslatedElement(T_VIEW_CUSTOMER).should("be.visible").click()
        cy.takeScreenshot("clicked_view_customer_button")

        cy.url().should("match", /\/customers\/\d+$/)
        cy.takeScreenshot("navigated_to_customer_page")
    })
})

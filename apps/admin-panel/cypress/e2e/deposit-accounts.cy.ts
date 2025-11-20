import { t } from "../support/translation"
import * as CustomerPage from "../support/pages/customer-page"
import * as DepositAccountPage from "../support/pages/deposit-account-page"
import { setupCustomerWithDepositAccount } from "../support/helpers/test-data"

describe("Deposit Accounts", () => {
  let customerPublicId: string
  let depositAccountPublicId: string

  before(() => {
    setupCustomerWithDepositAccount().then((data) => {
      customerPublicId = data.customerPublicId
      depositAccountPublicId = data.depositAccountPublicId
      cy.log(
        `Created customer with deposit account - Customer Public ID: ${customerPublicId}, Deposit Account Public ID: ${depositAccountPublicId}`,
      )
    })
  })

  const waitForLoad = () => {
    cy.get('[data-testid="loading-skeleton"]', { timeout: 30000 }).should("not.exist")
    cy.get('[data-testid="global-loader"]', { timeout: 30000 }).should("not.exist")
  }

  it("should navigate to deposit accounts page from sidebar", () => {
    cy.visit("/dashboard")
    cy.takeScreenshot("1_dashboard_page")
    cy.contains(t("Sidebar.navItems.dashboard"), { timeout: 10000 }).should("be.visible")
    cy.takeScreenshot("2_sidebar_visible")
    cy.contains(t("Sidebar.navItems.depositAccounts"), { timeout: 10000 }).click()
    cy.takeScreenshot("3_click_deposit_accounts_button")
    cy.url().should("include", "/deposit-accounts")
    cy.takeScreenshot("4_deposit_accounts_page")
    waitForLoad()
    cy.contains(t("DepositAccounts.title"), { timeout: 10000 }).should("be.visible")
    cy.get('[data-testid="deposit-account-table"]', { timeout: 10000 }).should("be.visible")
    cy.takeScreenshot("5_deposit_accounts_table_visible")
  })

  it("should show deposit accounts page content correctly", () => {
    cy.visit("/deposit-accounts")
    cy.takeScreenshot("1_direct_navigate_to_deposit_accounts")
    waitForLoad()
    cy.contains(t("DepositAccounts.title"), { timeout: 10000 }).should("be.visible")
    cy.contains(t("DepositAccounts.description"), { timeout: 10000 }).should("be.visible")
    cy.get('[data-testid="deposit-account-table"]', { timeout: 10000 }).should("be.visible")
    cy.takeScreenshot("2_table_rendered")
  })

  it("should highlight deposit accounts in sidebar when on deposit accounts page", () => {
    cy.visit("/deposit-accounts")
    cy.takeScreenshot("1_navigate_to_deposit_accounts")
    waitForLoad()
    cy.contains(t("Sidebar.navItems.depositAccounts"), { timeout: 10000 })
      .closest('[data-sidebar="menu-button"]')
      .should("have.attr", "data-active", "true")
    cy.takeScreenshot("2_sidebar_item_active")
  })

  it("should navigate to deposit account details page when clicking view button on first entry", () => {
    cy.visit("/deposit-accounts")
    cy.takeScreenshot("1_navigate_to_deposit_accounts_list")
    waitForLoad()
    cy.get('[data-testid="deposit-account-table"]', { timeout: 10000 }).should("be.visible")
    cy.get('[data-testid="table-row-0"]', { timeout: 10000 }).should("be.visible")
    cy.takeScreenshot("2_first_row_visible")
    cy.get('[data-testid="view-button-0"]', { timeout: 10000 }).should("be.enabled").click()
    cy.takeScreenshot("3_click_view_button")
    cy.url().should("match", /\/deposit-accounts\/[^/]+$/)
    cy.takeScreenshot("4_deposit_account_details_page")
    waitForLoad()
    cy.url().then((url) => {
      const depositAccountId = url.split("/deposit-accounts/")[1]
      expect(depositAccountId).to.be.a("string").and.have.length.greaterThan(0)
    })
    cy.takeScreenshot("5_verify_details_page_loaded")
  })

  it("should navigate from customer page deposit account card to deposit account page", () => {
    CustomerPage.visitCustomerPage(customerPublicId)
    cy.takeScreenshot("1_customer_page_deposit_account_card")
    CustomerPage.clickDepositAccountCardButton()
    cy.takeScreenshot("2_navigate_to_deposit_account")
    cy.url().should("include", `/deposit-accounts/${depositAccountPublicId}`)
    DepositAccountPage.verifyDepositAccountPageLoaded()
    cy.takeScreenshot("3_deposit_account_page_loaded")
  })

  it("should navigate from deposit account page customer card to customer page", () => {
    DepositAccountPage.visitDepositAccountPage(depositAccountPublicId)
    cy.takeScreenshot("1_deposit_account_page_customer_card")
    DepositAccountPage.clickCustomerCardButton()
    cy.takeScreenshot("2_navigate_to_customer")
    cy.url().should("include", `/customers/${customerPublicId}`)
    CustomerPage.verifyCustomerPageLoaded()
    cy.takeScreenshot("3_customer_page_loaded")
  })

  it("should open deposit and withdrawal dialogs from create menu on deposit account page", () => {
    DepositAccountPage.visitDepositAccountPage(depositAccountPublicId)
    cy.takeScreenshot("1_deposit_account_page")
    DepositAccountPage.openCreateMenu()
    cy.takeScreenshot("2_create_menu_opened")
    DepositAccountPage.clickCreateDepositOption()
    cy.takeScreenshot("3_deposit_dialog_opened")
    DepositAccountPage.verifyDepositDialogOpen()
    DepositAccountPage.closeDialog()
    cy.takeScreenshot("4_deposit_dialog_closed")
    DepositAccountPage.openCreateMenu()
    DepositAccountPage.clickCreateWithdrawalOption()
    cy.takeScreenshot("5_withdrawal_dialog_opened")
    DepositAccountPage.verifyWithdrawalDialogOpen()
  })
})


import { t } from "../support/translation"

describe("Deposit Accounts", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      if (
        err.message.includes("ResizeObserver loop") ||
        err.message.includes("cannot have a negative time stamp") ||
        err.message.includes("Failed to execute 'measure' on 'Performance'")
      ) {
        return false
      }
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
    cy.get('[data-testid="paginated-table"]', { timeout: 10000 }).should("be.visible")
    cy.takeScreenshot("5_deposit_accounts_table_visible")
  })

  it("should show deposit accounts page content correctly", () => {
    cy.visit("/deposit-accounts")
    cy.takeScreenshot("1_direct_navigate_to_deposit_accounts")
    waitForLoad()
    cy.contains(t("DepositAccounts.title"), { timeout: 10000 }).should("be.visible")
    cy.contains(t("DepositAccounts.description"), { timeout: 10000 }).should("be.visible")
    cy.get('[data-testid="paginated-table"]', { timeout: 10000 }).should("be.visible")
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
    cy.get('[data-testid="paginated-table"]', { timeout: 10000 }).should("be.visible")
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
})


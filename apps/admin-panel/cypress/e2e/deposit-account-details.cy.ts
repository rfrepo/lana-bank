import { faker } from "@faker-js/faker"

import { t } from "../support/translation"

const D = "Deposits"
const DEPOSIT_ACCOUNTS_URL = "/deposit-accounts"
const T_CUSTOMER_CARD_TITLE = "DepositAccounts.CustomerCard.title"
const T_DEPOSIT_ACCOUNT_DETAILS_TITLE = "DepositAccounts.DepositAccountDetails.title"

describe("Deposit Account Details", () => {
  let customerPublicId: string
  let depositAccountPublicId: string
  const depositAmount = faker.number.int({ min: 1000, max: 5000 })
  const withdrawAmount = faker.number.int({ min: 1000, max: depositAmount })

  before(() => {
    const testTelegramId = `t${Date.now()}`
    const testEmail = `t${Date.now().toString().slice(-6)}@example.com`

    cy.createCustomer(testEmail, testTelegramId).then((customer) => {
      customerPublicId = customer.publicId

      cy.graphqlRequest<{
        data: {
          customerByPublicId: {
            depositAccount: { publicId: string } | null
          }
        }
      }>(
        `query GetDepositAccountPublicId($id: PublicId!) {
          customerByPublicId(id: $id) {
            depositAccount {
              publicId
            }
          }
        }`,
        { id: customerPublicId },
      ).then((res) => {
        if (res.data.customerByPublicId.depositAccount) {
          depositAccountPublicId = res.data.customerByPublicId.depositAccount.publicId
        }
      })
    })
  })

  it("should navigate to deposit account details page and verify elements", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.takeScreenshot("deposit_account_details_page_loaded")

    cy.assertTranslationElementShouldBeVisible(T_DEPOSIT_ACCOUNT_DETAILS_TITLE)
    cy.assertTranslationElementShouldBeVisible(T_CUSTOMER_CARD_TITLE)
    cy.takeScreenshot("deposit_account_details_elements_visible")
  })

  it("should show create menu button on deposit account details page", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.takeScreenshot("deposit_account_details_before_create_menu")

    cy.get('[data-testid="global-create-button"]').should("be.visible")
    cy.takeScreenshot("create_button_visible")
  })

  it("should create a deposit from deposit account details page", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.wait(1000)
    cy.takeScreenshot("deposit_account_details_before_deposit")

    cy.get('[data-testid="global-create-button"]').click()

    cy.get('[data-testid="create-deposit-button"]').should("be.visible").click()
    cy.takeScreenshot("deposit_menu_item_selected")

    cy.get('[data-testid="deposit-amount-input"]').type(depositAmount.toString())
    cy.takeScreenshot("deposit_amount_entered")

    cy.get('[data-testid="deposit-submit-button"]').click()
    cy.takeScreenshot("deposit_submitted")

    cy.contains(t(D + ".CreateDepositDialog.success")).should("be.visible")
    cy.takeScreenshot("deposit_success_message")

    cy.url()
      .should("include", "/deposits/")
      .then(() => {
        cy.takeScreenshot("deposit_navigated_to_details")
      })
  })

  it("should create a withdrawal from deposit account details page", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.wait(1000)
    cy.takeScreenshot("deposit_account_details_before_withdrawal")

    cy.get('[data-testid="global-create-button"]').click()

    cy.get('[data-testid="create-withdrawal-button"]').should("be.visible").click()
    cy.takeScreenshot("withdrawal_menu_item_selected")

    cy.get('[data-testid="withdraw-amount-input"]').type(withdrawAmount.toString())
    cy.takeScreenshot("withdrawal_amount_entered")

    cy.get('[data-testid="withdraw-submit-button"]').click()
    cy.takeScreenshot("withdrawal_submitted")

    cy.url()
      .should("include", "/withdrawals/")
      .then(() => {
        cy.contains(`$${withdrawAmount.toLocaleString()}.00`).should("be.visible")
        cy.takeScreenshot("withdrawal_navigated_to_details")
      })
  })

  it("should show newly created deposit in deposit account transaction history", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.contains(`$${depositAmount.toLocaleString()}.00`).should("be.visible")
    cy.takeScreenshot("deposit_in_transaction_history")
  })

  it("should show newly created withdrawal in deposit account transaction history", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.contains(`$${withdrawAmount.toLocaleString()}.00`).should("be.visible")
    cy.takeScreenshot("withdrawal_in_transaction_history")
  })

  it("should show pagination controls for transaction history", () => {
    cy.visit(`${DEPOSIT_ACCOUNTS_URL}/${depositAccountPublicId}`)
    cy.get('[data-testid="deposit-account-history-table"]').within(() => {
      cy.get('[data-testid="pagination-previous"]').should("be.visible")
      cy.get('[data-testid="pagination-next"]').should("be.visible")
    })
  })
})

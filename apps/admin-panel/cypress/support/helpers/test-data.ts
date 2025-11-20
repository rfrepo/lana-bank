export const setupCustomerWithDepositAccount = (): Cypress.Chainable<{
    customerPublicId: string
    depositAccountPublicId: string
}> => {
    const testEmail = `t${Date.now().toString().slice(-6)}@example.com`
    const testTelegramId = `t${Date.now().toString().slice(-6)}`

    return cy.createCustomer(testEmail, testTelegramId).then((customer) => {
        return cy
            .graphqlRequest<{
                data: { customerByPublicId: { depositAccount: { publicId: string } } }
            }>(
                `query GetDepositAccountPublicId($id: PublicId!) {
          customerByPublicId(id: $id) {
            depositAccount {
              publicId
            }
          }
        }`,
                { id: customer.publicId },
            )
            .then((res) => ({
                customerPublicId: customer.publicId,
                depositAccountPublicId: res.data.customerByPublicId.depositAccount.publicId,
            }))
    })
}



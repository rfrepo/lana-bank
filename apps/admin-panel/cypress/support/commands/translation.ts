import { t } from "../translation"

const DEFAULT_TIMEOUT = 10000

Cypress.Commands.add(
    "findTranslatedElement",
    (translationKey: string, timeout = DEFAULT_TIMEOUT) => {
        const translatedText: string = t(translationKey)
        return cy.contains(translatedText, { timeout }) as unknown as Cypress.Chainable<JQuery<HTMLElement>>
    },
)

Cypress.Commands.add(
    "assertTranslationElementShouldBeVisible",
    (translationKey: string, timeout = DEFAULT_TIMEOUT) => {
        cy.findTranslatedElement(translationKey, timeout).should("be.visible")
    },
)

Cypress.Commands.add(
    "clickTranslatedElement",
    (translationKey: string, timeout = DEFAULT_TIMEOUT) => {
        cy.findTranslatedElement(translationKey, timeout).click()
    },
)

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            findTranslatedElement(
                translationKey: string,
                timeout?: number,
            ): Chainable<JQuery<HTMLElement>>
            assertTranslationElementShouldBeVisible(
                translationKey: string,
                timeout?: number,
            ): Chainable<void>
            clickTranslatedElement(
                translationKey: string,
                timeout?: number,
            ): Chainable<void>
        }
    }
}

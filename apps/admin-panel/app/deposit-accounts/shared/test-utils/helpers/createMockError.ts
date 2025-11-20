import { ApolloError } from '@apollo/client'

export const createMockError = (message: string): ApolloError =>
  new ApolloError({ errorMessage: message })


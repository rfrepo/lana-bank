import { gql } from "@apollo/client"

export {
    useDepositAccountFreezeMutation,
    DepositAccountFreezeDocument,
    GetDepositAccountDetailsPageDocument,
    type DepositAccountFreezeMutation,
    type DepositAccountFreezeMutationVariables,
} from "@/lib/graphql/generated"

gql`
  mutation DepositAccountFreeze($input: DepositAccountFreezeInput!) {
    depositAccountFreeze(input: $input) {
      account {
        id
        depositAccountId
      }
    }
  }
`

import { gql } from "@apollo/client"

export {
    useDepositAccountUnfreezeMutation,
    DepositAccountUnfreezeDocument,
    GetDepositAccountDetailsPageDocument,
    type DepositAccountUnfreezeMutation,
    type DepositAccountUnfreezeMutationVariables,
} from "@/lib/graphql/generated"

gql`
  mutation DepositAccountUnfreeze($input: DepositAccountUnfreezeInput!) {
    depositAccountUnfreeze(input: $input) {
      account {
        id
        depositAccountId
      }
    }
  }
`

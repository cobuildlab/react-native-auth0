export const USER_QUERY = `
  mutation UserSignUp($user: UserCreateInput!, $authProfileId: ID) {
    userSignUpWithToken(user: $user, authProfileId: $authProfileId) {
      id
      email
    }
  }
`;

export const CREATE_USER_QUERY = (email: string, authProfileId: string): string => (`
  mutation UserSignUp{
    userSignUpWithToken(user: { email: ${email} }, authProfileId: ${authProfileId}) {
      id
      email
    }
  }
`);
export const USER_QUERY = `
  query {
    user{
      id
      email
    }
  }
`;

export const CREATE_USER_QUERY = (email: string, authProfileId: string): string => (`
  mutation{
    userSignUpWithToken(user: { email: "${email}" }, authProfileId: "${authProfileId}") {
      id
      email
    }
  }
`);
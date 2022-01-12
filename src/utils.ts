import { User } from './types';
import { USER_QUERY, CREATE_USER_QUERY } from './constant';
 

export const fetchUser = async (endpoint: string, token: string): Promise<User> => {
  const request = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: USER_QUERY }),
  });

  const response = await request.json();

  return response as User;
};

type createUserParams = {
  endpoint: string;
  token: string;
  email: string;
  authProfileId: string;
}

export const createUser = async (params: createUserParams): Promise<User> => {
  const { endpoint, token, email, authProfileId } = params;
  const request = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      query: CREATE_USER_QUERY(email, authProfileId) 
    }),
  });

  const response = await request.json();

  return response as User;
};

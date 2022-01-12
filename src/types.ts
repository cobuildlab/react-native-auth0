import Auth0, { UserInfo, Credentials } from 'react-native-auth0';

export interface User {
  id: string;
  email: string;
}

export type UseAuthType = {
  credentials?: Credentials;
  userInfo?: UserInfo;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
};

export type AuthProviderConfig = {
  auth0: Auth0;
  eichBaseEndpoint: string;
  eichBaseToken: string;
  eichBaseAuthProfileId: string;
  getCredentials: () => Promise< Credentials | null>;
  removeCredentials: () => Promise<void>;
  saveCredentials: (credentials: Credentials) => Promise<void>;
}

export type AuthProviderProps = {
  config: AuthProviderConfig;
}
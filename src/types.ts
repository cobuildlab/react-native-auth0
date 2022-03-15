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
  auth: () => Promise<UserInfo | null>;
  login: () => void;
  logout: () => void;
};

export type AuthProviderProps = {
  auth0: Auth0;
  onGetCredentials: () => Promise< Credentials | null>;
  onSaveCredentials: (credentials: Credentials) => Promise<void>;
  onRemoveCredentials: () => Promise<void>;
}
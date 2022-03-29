import {
  AuthorizeOptions,
  Credentials as Auth0Credentials,
} from 'react-native-auth0';

export interface Credentials extends Auth0Credentials {
  issuedAt: number;
}

export type CredentialsHandlersInput = {
  save: (data: Credentials) => void | Promise<void>;
  clear: () => void | Promise<void>;
  get: () => (Credentials | null) | Promise<Credentials | null>;
};

export interface AuthClientContextType {
  authorize: (args: {
    scope?: string;
    options?: AuthorizeOptions;
  }) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  clearSession: () => Promise<void>;
}

export type ErrorCallbackType = (error: Error) => void;

export enum ErrorCases {
  AUTHORIZATION = 'AUTHORIZATION',
  CLEAR_SESSION = 'CLEAR_SESSION',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}

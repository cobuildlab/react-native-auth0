import {
  AuthorizeOptions,
  Credentials as Auth0Credentials,
  Options as Auth0Options,
} from 'react-native-auth0';

export interface Credentials extends Auth0Credentials {
  issuedAt?: number;
}

export interface Options extends Auth0Options {
  audience?: string;
}
export type tokenToValidateType = keyof Pick<
  Credentials,
  'idToken' | 'accessToken'
>;
interface CredentialsHandlersInputBase {
  save: (data: Credentials) => void | Promise<void>;
  clear: () => void | Promise<void>;
  get: () => (Credentials | null) | Promise<Credentials | null>;
}
export type CredentialsHandlersInput = CredentialsHandlersInputBase &
  (
    | {
        validateToken: (data: Credentials) => boolean;
        tokenToValidate?: tokenToValidateType;
      }
    | {
        tokenToValidate: tokenToValidateType;
        validateToken?: (data: Credentials) => boolean;
      }
  );

export interface AuthClientContextType {
  authorize: (
    args:
      | {
          scope?: string;
          options?: AuthorizeOptions;
        }
      | undefined,
  ) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  clearSession: () => Promise<void>;
}

export type ErrorCallbackType = (error: Error) => void;

export enum ErrorCases {
  AUTHORIZATION = 'AUTHORIZATION',
  CLEAR_SESSION = 'CLEAR_SESSION',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  SAVE_CREDENTIALS = 'SAVE_CREDENTIALS',
}

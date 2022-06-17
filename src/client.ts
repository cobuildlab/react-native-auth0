import Auth0, {
  AuthorizeOptions,
  Credentials as Auth0Credentials,
} from 'react-native-auth0';
import {
  Credentials,
  CredentialsHandlersInput,
  ErrorCases,
  Options,
  tokenToValidateType,
} from './types';
import { ErrorPublisher, validateToken } from './utils';

export class Auth0Native extends Auth0 {
  private credentials: Credentials | null = null;
  private audience: string;

  private saveCredentials: CredentialsHandlersInput['save'];
  private getCredentials: CredentialsHandlersInput['get'];
  private clearCredentials: CredentialsHandlersInput['clear'];
  private validateToken?: CredentialsHandlersInput['validateToken'];
  private tokenToValidate?: tokenToValidateType;
  private errors: Record<ErrorCases, ErrorPublisher> = {
    AUTHORIZATION: new ErrorPublisher(),
    CLEAR_SESSION: new ErrorPublisher(),
    REFRESH_TOKEN: new ErrorPublisher(),
    SAVE_CREDENTIALS: new ErrorPublisher(),
  };

  /**
   * Create a client to used to authenticate with auth0 platform and manage that auth state.
   *
   * @param {Options} options - Options.
   * @param {CredentialsHandlersInput} credentialsHandlers - Options to handle the credentials and token validations.
   */
  constructor(options: Options, credentialsHandlers: CredentialsHandlersInput) {
    super(options);
    this.saveCredentials = credentialsHandlers.save;
    this.getCredentials = credentialsHandlers.get;
    this.clearCredentials = credentialsHandlers.clear;
    this.validateToken = credentialsHandlers.validateToken;
    this.tokenToValidate = credentialsHandlers.tokenToValidate;

    // set a default audience if the options is undefined
    this.audience = options.audience || `https://${options.domain}/api/v2/`;
  }

  async handleCredentials(data: Auth0Credentials): Promise<Credentials> {
    const credentials: Credentials = { ...data };
    try {
      await this.saveCredentials(credentials);
    } catch (error) {
      this.errors.SAVE_CREDENTIALS.notify(error as Error);
    }

    this.credentials = credentials;

    return credentials;
  }

  getAuthInfo(): Credentials | null {
    return this.credentials;
  }

  async retrieveCredentials(): Promise<Credentials> {
    const isAuthenticated = await this.isAuthenticated();

    if (!isAuthenticated || !this.credentials) {
      throw new Error('User is not authenticated');
    }

    return this.credentials;
  }

  /**
   *
   * @param {string} scope -  Scopes requested for the issued tokens. E.g. `openid profile`.
   * @param {AuthorizeOptions} options - Options to pass to the auth endpoint.
   * @returns {Promise<Credentials | undefined>} The auth0 credentials.
   */
  async authorize(
    scope: string,
    options: AuthorizeOptions = {},
  ): Promise<Credentials | undefined> {
    try {
      const result = await this.webAuth.authorize(
        {
          scope,
          audience: this.audience,
        },
        options,
      );

      return this.handleCredentials(result);
    } catch (error) {
      this.errors.AUTHORIZATION.notify(error as Error);

      throw error;
    }
  }

  async clearSession(): Promise<void> {
    this.credentials = null;

    try {
      this.webAuth.clearSession();
    } catch (error) {
      this.errors.CLEAR_SESSION.notify(error as Error);
    }

    await this.clearCredentials();
  }

  async isAuthenticated(): Promise<boolean> {
    const credentials = this.credentials || (await this.getCredentials());

    if (!credentials) {
      return false;
    }
    let valid = false;

    if (this.validateToken && this.validateToken(credentials)) {
      valid = true;
    }

    if (
      this.tokenToValidate &&
      validateToken(credentials[this.tokenToValidate])
    ) {
      valid = true;
    }

    if (valid) {
      this.credentials = credentials;
      return true;
    }

    if (credentials.refreshToken) {
      try {
        const newCredentials = await this.auth.refreshToken({
          refreshToken: credentials.refreshToken,
        });

        await this.handleCredentials({
          ...newCredentials,
          scope: credentials.scope,
        });

        return true;
      } catch (error) {
        this.errors.REFRESH_TOKEN.notify(error as Error);
        return false;
      }
    }

    return false;
  }
}

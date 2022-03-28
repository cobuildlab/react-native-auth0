import Auth0, {
  AuthorizeOptions,
  Credentials as Auth0Credentials,
  Options,
} from 'react-native-auth0';
import { Credentials, CredentialsHandlersInput, ErrorCases } from './types';
import { ErrorPublisher, getTimestamp } from './utils';

export class Auth0Native extends Auth0 {
  private credentials: Credentials | null = null;

  private saveCredentials: CredentialsHandlersInput['save'];

  private getCredentials: CredentialsHandlersInput['get'];

  private clearCredentials: CredentialsHandlersInput['clear'];

  private errors: Record<ErrorCases, ErrorPublisher> = {
    AUTHORIZATION: new ErrorPublisher(),
    CLEAR_SESSION: new ErrorPublisher(),
    REFRESH_TOKEN: new ErrorPublisher(),
  };

  constructor(options: Options, credentialsHandlers: CredentialsHandlersInput) {
    super(options);
    this.saveCredentials = credentialsHandlers.save;
    this.getCredentials = credentialsHandlers.get;
    this.clearCredentials = credentialsHandlers.clear;
  }

  async handleCredentials(data: Auth0Credentials): Promise<Credentials> {
    const credentials: Credentials = { ...data, issuedAt: getTimestamp() };

    await this.saveCredentials(credentials);

    this.credentials = credentials;

    return credentials;
  }

  getAuthInfo(): Credentials | null {
    return this.credentials;
  }

  /**
   *
   * @param {string} scope -  Scopes requested for the issued tokens. E.g. `openid profile`.
   * @param {object} options - Options to pass to the auth endpoint.
   * @returns {object} The auth0 credentials.
   */
  async authorize(
    scope: string,
    options: AuthorizeOptions = {},
  ): Promise<Credentials | undefined> {
    try {
      const result = await this.webAuth.authorize(
        {
          scope,
        },
        options,
      );

      return this.handleCredentials(result);
    } catch (error) {
      this.errors.AUTHORIZATION.notify(error as Error);
      return;
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

    const tokenTimestamp = credentials.expiresIn + credentials.issuedAt;

    const validToken = tokenTimestamp > getTimestamp();

    if (validToken) {
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

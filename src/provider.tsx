import * as React from 'react';
import jwt_decode from 'jwt-decode';
import { UserInfo, Credentials } from 'react-native-auth0';
import { AuthContext } from './context';
import { AuthProviderProps } from './types';


export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  auth0, 
  onSaveCredentials, 
  onGetCredentials, 
  onRemoveCredentials 
}) => {
  const [credentials, setCredentials] = React.useState<Credentials>();
  const [userInfo, setUserInfo] = React.useState<UserInfo>();
  const [isAuthenticated, setAuthenticated] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);

  /**
   * @description - Function called after user to be authenticated.
   * @param {Credentials} _credentials  - Credentials.
   */
  const onSaveToken = React.useCallback(async (
    _credentials: Credentials,
  ): Promise<void> => {
    try {
      await onSaveCredentials(_credentials);
    } catch (error) {
      throw new Error('Error saved credentials');
    }
  }, [onSaveCredentials]);


  /**
   * @description -  Function called AuthenticateCheck for get token store in local.
   * @returns {Credentials | null} - RReturns the credentials if it finds one otherwise it returns null.
   */
  const onGetStoreToken = async (): Promise<Credentials | null> => {
    try {
      const token = await onGetCredentials();
      return token;
    } catch (error) {
      console.error('Error get store', JSON.stringify(error));
      throw new Error('Error get store');
    }
  };

  /**
   * @description - Function called on logout for remove the credentials stored.
   */
  const removeToken = React.useCallback(async (): Promise<void> => {
    try {
      await onRemoveCredentials();
    } catch (error) {
      console.error('Error delete store token', JSON.stringify(error));
      throw new Error('Error delete store token');
    }
    setUserInfo(undefined);
    setCredentials(undefined);
    setAuthenticated(false);
    setLoading(false);
  }, [onRemoveCredentials]);


  const login = React.useCallback(async () => {
    // to have more control when dispatching avoid using the createAction here
    setLoading(true);
    let authorizeResponse: Credentials;
    // first step login in auth0.
    try {
      authorizeResponse = await auth0.webAuth.authorize({
        scope: 'openid profile email',
      });
    } catch (error) {
      console.log('webAuth:', JSON.stringify(error));
      setLoading(false);
      setAuthenticated(false);
      throw new Error('webAuth.authorize Error');
    }

    const authorizeUserInfo = jwt_decode(authorizeResponse.idToken) as UserInfo;

    await onSaveToken(authorizeResponse);
   
    setCredentials(authorizeResponse);
    setUserInfo(authorizeUserInfo);
    setAuthenticated(true);
    setLoading(false);
  }, [auth0, onSaveToken]);



  const logout = React.useCallback(async () => {
    setLoading(true);
    try {
      await auth0.webAuth.clearSession();
    } catch (error) {
      console.error('Logount error', JSON.stringify(error));
      throw new Error('Error in logout');
    }
    removeToken();
  }, [auth0, removeToken]);


  const auth = async (): Promise<UserInfo | null> => {
    const storedCredentials = await onGetStoreToken();

    if (!storedCredentials) {
      setLoading(false);
      return null;
    }

    let request;
    try {
      request = await auth0.auth.userInfo({
        token: storedCredentials.accessToken,
      });
    } catch (error) {
      console.warn('Authenticate error', JSON.stringify(error));
      removeToken();
      return null;
    }

    setCredentials(storedCredentials);
    setUserInfo(request);
    setAuthenticated(true);
    setLoading(false);
    return request;
  };

  return (
    <AuthContext.Provider
      value={{
        credentials,
        userInfo,
        isAuthenticated,
        isLoading,
        login,
        logout,
        auth
      }}>
      {children}
    </AuthContext.Provider>
  );
};

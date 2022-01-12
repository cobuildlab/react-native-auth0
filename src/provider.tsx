/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import jwt_decode from 'jwt-decode';
import { UserInfo, Credentials } from 'react-native-auth0';

import { AuthContext } from './context';
import { fetchUser, createUser } from './utils';
import { AuthProviderProps } from './types';


export const AuthProvider: React.FC<AuthProviderProps> = ({ children, config }) => {
  const { auth0, eichBaseEndpoint, eichBaseToken, eichBaseAuthProfileId, saveCredentials, getCredentials, removeCredentials  } = config;
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
      await saveCredentials(_credentials);
    } catch (error) {
      throw new Error('Error saved credentials');
    }
  }, [saveCredentials]);


  /**
   * @description -  Function called AuthenticateCheck for get token store in local.
   * @returns {Credentials | null} - RReturns the credentials if it finds one otherwise it returns null.
   */
  const onGetStoreToken = async (): Promise<Credentials | null> => {
    try {
      const token = await getCredentials();
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
      await removeCredentials();
    } catch (error) {
      console.error('Error delete store token', JSON.stringify(error));
      throw new Error('Error delete store token');
    }
    setAuthenticated(false);
    setLoading(false);
  }, [removeCredentials]);


  const login = React.useCallback(async () => {
    console.log('calling lodgin');
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

    const email = authorizeUserInfo?.email;
    try {
      // This hook should not depend on any action, but for the little time I have I leave it like this
      await fetchUser(eichBaseEndpoint, eichBaseToken);
    } catch (error) {
      console.log('eichbase error', JSON.stringify(error));
      await createUser({ 
        endpoint: eichBaseEndpoint, 
        token: eichBaseToken, 
        email, 
        authProfileId: eichBaseAuthProfileId 
      });
    }

    await onSaveToken(authorizeResponse);
   
    setCredentials(authorizeResponse);
    setUserInfo(authorizeUserInfo);
    setAuthenticated(true);
    setLoading(false);
  }, [eichBaseEndpoint, eichBaseToken, auth0, eichBaseAuthProfileId, onSaveToken]);



  const logout = React.useCallback(async () => {
    console.log('logout');
    try {
      await auth0.webAuth.clearSession();
    } catch (error) {
      console.error('Logount error', JSON.stringify(error));
      throw new Error('Error in logout');
    }
    removeToken();
  }, [auth0, removeToken]);


  const AuthenticateCheck = async (): Promise<void> => {
    console.log('start auth --- getting store token', auth0);
    const storedCredentials = await onGetStoreToken();

    if (!storedCredentials) {
      setLoading(false);
      return;
    }

    console.log('requesting auth token');

    let request;
    try {
      request = await auth0.auth.userInfo({
        token: storedCredentials.accessToken,
      });
    } catch (error) {
      console.error('Authenticate error', JSON.stringify(error));
      removeToken();
    }

    setCredentials(storedCredentials);
    setUserInfo(request);
    setAuthenticated(true);
    setLoading(false);
  };

  React.useEffect(() => {
    console.log('use effect');
    AuthenticateCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        credentials,
        userInfo,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

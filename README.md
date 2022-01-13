# TODO 
  
  - Documentation
  - Refresh Token
  - Auth0 Params
  - Clean Code
  - Test Code


Basic use: 

```tsx
import React from 'react';
import { View, Button, Text } from 'react-native';
import { useAuth, AuthProviderConfig, AuthProvider } from '@cobuildlab/react-native-auth0';
import { Credentials } from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { auth0 } from './src/shared/auth0/client';

const App: React.FC = () => {
  const { login, logout, isLoading, isAuthenticated } = useAuth();
  console.log('---- isAuthenticated --- ', isAuthenticated);
  console.log('---- isLoading --- ', isLoading);

  return (
    <View>
      <Text>{isAuthenticated ? 'Im On' : 'Im Off'}</Text>
      <Button onPress={login} title="login" />
      <Button onPress={logout} title="logout" />
    </View>
  );
};

const Conifg: AuthProviderConfig = {
  auth0,
  eichBaseToken: '8base-token',
  eichBaseAuthProfileId: 'my-profile-id',
  eichBaseEndpoint: '8base-environemnt-branch',
  removeCredentials: async () => {
    await AsyncStorage.removeItem('credentials_store');
  },
  saveCredentials: async (credentials) => {
    const value = JSON.stringify(credentials);
    await AsyncStorage.setItem('credentials_store', value);
  },
  getCredentials: async (): Promise<Credentials | null> => {
    const value = await AsyncStorage.getItem('credentials_store');
    return value != null ? JSON.parse(value) : null;
  },
};

export const App = () => {
  return (
    <AuthProvider config={Conifg}>
      <App />
    </AuthProvider>
  );
};
```


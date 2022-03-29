# TODO 
  
  - Documentation
  - Refresh Token
  - Auth0 Params
  - Clean Code
  - Test Code

# React Native Auth0

A wrapper on auth0's react native library with common case features already implemented.

## Installation

1. Run on your terminal the following command:

```sh
$ npm i @cobuildlab/react-native-auth0
```
## Usage

Create a new client instance using Auth0Native:

```tsx
import { Auth0Native } from '@cobuildlab/react-native-auth0';

// AUTH0 options
const AUTH0_OPTIONS = {
  clientId: AUTH_CLIENT_ID,
  domain: AUTH_CLIENT_DOMAIN,
}

// You can handle the credentials obtained in auth0 and store them in the async store or another store of your choice
const CREDENTIALS_HANDLER = {
  save: async (credentials): Promise<void> => {
    const value = JSON.stringify(credentials);
    await AsyncStorage.setItem('credentials_store', value);
  },
  get: async () => {
    const value = await AsyncStorage.getItem('credentials_store');
    return value != null ? JSON.parse(value) : null;
  },
  clear: async () => {
    await AsyncStorage.removeItem('credentials_store');
    apolloClient.resetStore();
  },
}

export const client = new Auth0Native(AUTH0_OPTIONS, CREDENTIALS_HANDLER);
```


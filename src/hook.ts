import * as React from 'react';

import { AuthClientContext } from './context';
import { AuthClientContextType } from './types';

export const useAuth = (): AuthClientContextType =>
  React.useContext(AuthClientContext);

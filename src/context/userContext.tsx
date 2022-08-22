import { InferQueryOutput } from '@frontend/utils/trpc';
import { createContext, ReactNode, useContext } from 'react';

const UserContext = createContext<InferQueryOutput<'users.me'>>(null);

interface Props {
  children: ReactNode;
  value?: InferQueryOutput<'users.me'>;
}

export const UserContextProvider = ({ children, value }: Props) => {
  return (
    <UserContext.Provider value={value || null}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

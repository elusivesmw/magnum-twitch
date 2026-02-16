import { AppContext } from '@/context/app';
import { useContext } from 'react';

export function useRequiredContext() {
  const context = useContext(AppContext);

  // condition after calling all hooks
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  return context;
}

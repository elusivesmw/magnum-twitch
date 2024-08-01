'use client';
import { AppContext } from '@/context/context';
import { useContext } from 'react';

export default function () {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }
  return (
    <div>
      settings
      {context.user?.login}
    </div>
  );
}

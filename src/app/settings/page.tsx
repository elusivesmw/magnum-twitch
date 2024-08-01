'use client';

import { AppContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

export default function Settings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  const router = useRouter();
  return (
    <div>
      <div>settings</div>
      <div>{context.user?.login}</div>
      <button onClick={() => router.push(`/${context.order.join('/')}`)}>
        go back
      </button>
    </div>
  );
}

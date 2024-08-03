'use client';

import { AppContext } from '@/context/context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Settings() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('This component requires AppProvider as a parent');
  }

  useEffect(() => {
    context.setUpdatePath(false);
  }, []);

  const router = useRouter();
  let path = `/${context.order.join('/')}?v=${context.playerView}`;

  return (
    <div>
      <div>settings</div>
      <div>{context.user?.login}</div>
      <button onClick={() => router.push(path)}>go back</button>
    </div>
  );
}

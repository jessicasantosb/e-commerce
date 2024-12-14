'use client';

import { useStoreModal } from '@/hooks/use-store-modal';
import { useEffect } from 'react';

export default function SetupPage() {
  const { onOpen, isOpen } = useStoreModal((state) => state);

  useEffect(() => {
    if (!isOpen) onOpen();
  }, [isOpen, onOpen]);

  return (
    <main>
      <h2 className='p-4'>Route Page!</h2>
    </main>
  );
}

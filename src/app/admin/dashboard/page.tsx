'use client';

import { useTranslations } from 'next-intl';
import { Main } from '@/components/layout/main';

export default function Page() {
  const t = useTranslations('dashboard');

  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
      </div>
    </Main>
  );
}

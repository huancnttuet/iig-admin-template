'use client';

import { Button } from '@/components/ui/button';
import { AppRoutes } from '@/configs/routes';
import { useGetProfile, useSSOLogin } from '@/features/auth';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const loginMutation = useSSOLogin();
  const getProfileMutation = useGetProfile();

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (code) {
      loginMutation
        .mutateAsync(code)
        .then(() => {
          // Fetch user profile
          getProfileMutation
            .mutateAsync()
            .then(() => {
              // Show success message
              toast.success(t('common.signInSuccess'));

              // Redirect to return URL or dashboard
              const returnUrl = searchParams.get('redirect');
              router.push(returnUrl || AppRoutes.Dashboard);
            })
            .catch(() => {
              setIsError(true);
            });
        })
        .catch(() => {
          setIsError(true);
        });
    }
  }, [code]);

  if (error) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        {error}
      </div>
    );
  }

  return (
    <div
      className='flex h-screen w-screen flex-col items-center justify-center
        gap-4'
    >
      {isError || loginMutation.isError ? (
        <>
          Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.
          <Button onClick={() => router.push(AppRoutes.SignIn)}>
            Trang chủ
          </Button>
        </>
      ) : (
        <>Đang đăng nhập, vui lòng chờ trong giây lát...</>
      )}
    </div>
  );
}

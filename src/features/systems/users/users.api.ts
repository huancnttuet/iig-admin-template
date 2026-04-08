import baseApi from '@/apis/base-api';
import type { GetUsersParams, User } from './users.type';
import { PagedList } from '@/types/api';

export const getPagedUsers = async (
  params: GetUsersParams,
): Promise<PagedList<User>> => {
  const res = await baseApi.get<PagedList<User>>('/users/paged-list', {
    params,
  });
  return res.data;
};

export const syncUsers = async (): Promise<void> => {
  await baseApi.post('/users/sync');
};

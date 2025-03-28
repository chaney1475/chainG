import { UserSummary } from '@/types/user'

import { getRequest } from './api'

//getMySummary
export const getMySummary = async () =>
  await getRequest<UserSummary>('/users/me/summary')

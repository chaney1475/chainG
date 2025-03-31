import {
  CreateLifeRuleRequest,
  GetLifeRuleResponse,
  PostLifeRuleResponse,
  UpdateLifeRule,
} from '@/types/lifeRule'

import { getRequest, postBooleanRequest, postRequest } from './api'

//getLifeRule
export const getLifeRule = async () =>
  await getRequest<GetLifeRuleResponse>(`/life-rule`)

//createLifeRule
export const createLifeRule = async (rules: CreateLifeRuleRequest) =>
  await postRequest<PostLifeRuleResponse>(`/life-rule`, rules)

//getUpdateLifeRule
export const getUpdateLifeRule = async () =>
  await getRequest<UpdateLifeRule[]>(`/life-rule/update-temp`)

//updateLifeRule
export const updateLifeRule = async (updates: UpdateLifeRule[]) =>
  await postRequest<UpdateLifeRule[]>(`/life-rule/update-temp`, {
    updates: updates,
  })

//recommendCategory0
export const recommendCategory = async (params: { content: string }) =>
  await postRequest<{ category: string }>(`/life-rule/category`, params)

//approveUpdateForm
export const approveUpdateForm = async (params: { approved: boolean }) =>
  await postBooleanRequest(`/life-rule/approved`, params)

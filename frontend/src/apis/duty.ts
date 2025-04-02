import { Duty, DutyRequest, DutyWeekList } from '@/types/duty'

import { deleteRequest, getRequest, patchRequest, postRequest } from './api'

//getDuties
export const getDuties = async (groupId: number) =>
  await getRequest<DutyWeekList>(`/duty/${groupId}`)

//createDuty
export const createDuty = async (groupId: number, duty: DutyRequest) =>
  await postRequest<Duty>(`/duty/${groupId}`, duty)

//deleteDuty
export const deleteDuty = async (dutyId: number) =>
  await deleteRequest<{ deletedId: number }>(`/duty/${dutyId}`)

//modifyDuty
export const modifyDuty = async (dutyId: number, duty: DutyRequest) =>
  await patchRequest<Duty>(`/duty/${dutyId}`, duty)

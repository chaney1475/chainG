import {
  Contract,
  ContractRequest,
  ContractUser,
  CreateContractResponse,
} from '@/types/contract'
import { CreateGroupRequest, Group, JoinGroupsRequest } from '@/types/group'

import { getRequest, postBooleanRequest, postRequest, putRequest } from './api'

//getContract
export const getContract = async (contractId: string) =>
  await getRequest<Contract>(`/contract/${contractId}`)

//updateContract
export const updateContract = async ({
  contractId,
  contract,
}: {
  contractId: string
  contract: ContractRequest
}) => await putRequest<Contract>(`/contract/${contractId}`, contract)

//confirmContract
export const confirmContract = async ({
  contractId,
  contract,
}: {
  contractId: string
  contract: ContractRequest
}) => await putRequest<Contract>(`/contract/${contractId}/pending`, contract)

//createGroup
export const createGroup = async (params: CreateGroupRequest) =>
  await postRequest<Group>('/groups', params)

//joinGroup
export const joinGroup = async (params: JoinGroupsRequest) =>
  await postRequest<Group>('/groups/join', params)

//createEmptyContract
export const createEmptyContract = async (params: { groupId: string }) =>
  await postRequest<CreateContractResponse>('/contract', params)

//approveContract
export const approveContract = async (contractId: string) =>
  await postBooleanRequest(`/contract/${contractId}/approve`)

//getGroup
export const getGroup = async (groupId: string) =>
  await getRequest<Group>(`/groups/${groupId}`)

//getGroupByInviteCode
export const getGroupByInviteCode = async () =>
  await getRequest<Group>('/groups/search')

//getContractMembers
export const getContractMembers = async (contractId: string) =>
  await getRequest<ContractUser[]>(`/contract/${contractId}/members`)

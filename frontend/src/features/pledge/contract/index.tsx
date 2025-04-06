'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  approveContract,
  confirmContract,
  createContractPDF,
  getContract,
} from '@/apis/group'
import { ConfirmButton, InputBox, Modal, TopHeader } from '@/components'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setShowContractApprovedModal } from '@/store/slices/appSlice'
import { setContract } from '@/store/slices/contractSlice'
import { ImageContainer, Label, PaddingContainer, Title } from '@/styles/styles'
import { ContractStatus, RentUser } from '@/types/contract'

import { ContractViewer } from './component/ContractViewer'
import { BottomContainer, Container, FullMain, HeaderContainer } from './styles'

export function ContractDetail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { register, handleSubmit } = useForm<{ accountNo: string }>({
    defaultValues: { accountNo: '' },
  })
  const user = useAppSelector((state) => state.user.user)
  const group = useAppSelector((state) => state.group.group)
  const contract = useAppSelector((state) => state.contract.contract)
  const contractMembers = useAppSelector(
    (state) => state.contract.contractMembers,
  )

  const [status, setStatus] = useState<ContractStatus>(
    ContractStatus.none as ContractStatus,
  )


  const rentUserList: RentUser[] = group.members.map((member) => {
    return {
      ...member,
      amount:
        contract.rent.userPaymentInfo.find((info) => info.userId === member.id)
          ?.amount ?? 0,
      ratio:
        contract.rent.userPaymentInfo.find((info) => info.userId === member.id)
          ?.ratio ?? 0,
    }
  })

  const [title, setTitle] = useState('contract.detail.none.title')
  const [label, setLabel] = useState('contract.detail.none.label')
  const [button, setButton] = useState('contract.detail.none.button')
  const [description, setDescription] = useState(
    'contract.detail.none.description',
  )
  const { t } = useTranslation()
  const savePdf = async () => {
    const response = await createContractPDF(contract.id)
    if (response.success) {
      const url = response.data.presignedUrl
      window.open(url, '_blank')
      // router.push('/contract')
    }
  }
  useEffect(() => {
    setTitle(`contract.detail.${status.toLowerCase()}.title`)
    setLabel(`contract.detail.${status.toLowerCase()}.label`)
    setButton(`contract.detail.${status.toLowerCase()}.button`)
    setDescription(`contract.detail.${status.toLowerCase()}.description`)
  }, [status])

  const approveContractWithAccountNo = async (data: { accountNo: string }) => {
    console.log('approveContractWithAccountNo')
    console.log(data)
    const success = await approveContract(contract.id, {
      accountNo: data.accountNo,
    })
    if (success) {
      await fetchContract()
      dispatch(setShowContractApprovedModal(true))
    }
    setOpenModal(false)
    router.push('/contract')
  }
  const fetchContract = useCallback(async () => {
    if (user.contractId) {
      const response = await getContract(user.contractId)
      if (response.success) {
        dispatch(setContract(response.data))
      }
    }
  }, [user.contractId, dispatch])

  const confirmModal = async () => {
    console.log('confirmModal status', status)
    if (status === ContractStatus.pending) {
      await handleSubmit(approveContractWithAccountNo)()
    } else if (status === ContractStatus.isContractApproved) {
      router.push('/contract/create')
      
      // await handleSubmit(modifyContract)()
    }
  }
  const [shouldConfirm, setShouldConfirm] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [modalConfirmText, setModalConfirmText] = useState('')

  useEffect(() => {
    const handleConfirm = async () => {
      if (shouldConfirm) {
        console.log('handleConfirm')
        console.log(contract.status)
        await updateStatus()
      }
    }
    handleConfirm()
  }, [contract.status, shouldConfirm])

  useEffect(() => {
    const member = contractMembers.find((member) => member.id === user.id)
    if (
      member &&
      member?.status === ContractStatus.confirmed &&
      contract.status === ContractStatus.pending
    ) {
      setStatus(ContractStatus.isContractApproved)
    } else {
      setStatus(contract.status)
    }
  }, [user.id, contractMembers, contract.status])

  const updateContractRequest = async () => {
    if (!user.contractId) {
      return
    }
    const response = await confirmContract({
      contractId: user.contractId,
      contract: contract,
    })
    if (response.success) {
      dispatch(setContract(response.data))
      router.push('/contract/detail')
    }
  }
  const updateStatus = async () => {
    switch (status) {
      case ContractStatus.none:
        console.log(t('contract.detail.none.title'))
        router.push('/contract/create')
        break
      case ContractStatus.draft:
        console.log(t('contract.detail.draft.title'))
        await updateContractRequest()
        setShouldConfirm(false)
        break
      case ContractStatus.isContractApproved:
        console.log(t('contract.detail.is_contract_approved.title'))
        setModalTitle(t('contract.modify.title'))
        setModalDescription(t('contract.modify.description'))
        setModalConfirmText(t('contract.modify.confirmText'))
        setOpenModal(true)
        // router.push('/contract/create')
        break
      case ContractStatus.pending:
        setModalTitle(t('contract.approve.title'))
        setModalDescription(t('contract.approve.description'))
        setModalConfirmText(t('contract.approve.confirmText'))
        setOpenModal(true)
        break
      case ContractStatus.reviewRequired:
        console.log(t('contract.detail.review_required.title'))
        setModalTitle(t('contract.detail.review_required.title'))
        setModalDescription(t('contract.detail.review_required.description'))
        setModalConfirmText(t('contract.detail.review_required.confirmText'))
        setOpenModal(true)
        break
      case ContractStatus.confirmed:
        console.log(t('contract.detail.confirmed.title'))
        await savePdf()
        break
    }
  }

  return (
    <>
      <FullMain>
        <HeaderContainer>
          <ImageContainer>
            <Image
              src="/images/contract/contract-detail.png"
              alt="contract"
              width={68}
              height={87}
            />
          </ImageContainer>
          <Title>{t(label)}</Title>
          <Label>{t(description, { value: group.name })}</Label>
          <ConfirmButton
          label={button}
          onClick={() => setShouldConfirm(true)}
        />
        </HeaderContainer>
        {user.contractId && rentUserList && (
          <ContractViewer
            contract={contract}
            rentUserList={rentUserList}
          />
        )}
      </FullMain>
    </>
  )
}

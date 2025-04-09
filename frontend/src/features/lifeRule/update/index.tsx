'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { updateLifeRule } from '@/apis/lifeRule'
import { Modal } from '@/components/'
import { ConfirmButton } from '@/components/ConfirmButton'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { useAppSelector } from '@/hooks/useAppSelector'
import { setHomeOverviewLifeRuleApproved } from '@/store/slices/userSlice'
import { Container } from '@/styles/styles'
import { LifeRule, LifeRuleUpdateVariant } from '@/types/lifeRule'

import { LifeRuleUpdateListItem } from '../components/LifeRuleUpdateListItem'
import { ConfirmContainer, FullMain, LifeRuleUpdateList } from './styles'

type FormValues = {
  items: Array<{
    id: number
    variant: LifeRuleUpdateVariant
    actionType: LifeRuleUpdateVariant
    content: string
    rule: LifeRule
  }>
}

export function LifeRuleUpdatePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const lifeRules = useAppSelector((state) => state.lifeRule.lifeRules)

  const methods = useForm<FormValues>({
    defaultValues: {
      items: lifeRules.map((rule) => ({
        id: rule.id,
        variant: 'DEFAULT',
        actionType: 'DEFAULT',
        category: 'OTHER',
        content: rule.content,
        rule,
      })),
    },
  })

  const { fields, append, update } = useFieldArray({
    control: methods.control,
    name: 'items',
    keyName: 'fieldId',
  })

  const items = methods.watch('items')
  const [isUpdated, setIsUpdated] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [localContents, setLocalContents] = useState<{ [key: string]: string }>(
    {},
  )

  useEffect(() => {
    if (lifeRules?.length > 0) {
      methods.setValue(
        'items',
        lifeRules.map((rule: LifeRule) => ({
          id: rule.id,
          rule,
          variant: 'DEFAULT',
          actionType: 'DEFAULT',
          content: rule.content,
        })),
      )
    }
  }, [lifeRules, methods])

  const handleVariantChange = (
    id: string | number,
    newVariant: LifeRuleUpdateVariant,
  ) => {
    try {
      const itemIndex = items.findIndex(
        (item) => String(item.id) === String(id),
      )

      if (itemIndex === -1) {
        console.error('Item not found with id:', id)
        return
      }

      const currentItem = items[itemIndex]
      const updatedContent =
        newVariant === 'UPDATE' ? currentItem.rule.content : currentItem.content

      update(itemIndex, {
        ...currentItem,
        variant: newVariant,
        actionType: newVariant,
        content: updatedContent,
      })

      setIsUpdateMode(true)
      setIsUpdated(true)
    } catch (error) {
      console.error('Error in handleVariantChange:', error)
    }
  }

  // 디버깅을 위한 items 변경 감지
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const debugUpdates = items.map((item) => ({
        id: Number(item.id),
        content: item.content.trim(),
        category: item.rule.category,
        actionType: item.actionType,
        variant: item.variant,
      }))
      console.log('items updated:', debugUpdates)
    }
  }, [items])

  const handleCreateNew = () => {
    const newRule = {
      id: Date.now(),
      content: '',
      category: 'OTHER',
    }

    append({
      id: Date.now(), // 현재시간으로 생성해버리기
      rule: newRule,
      variant: 'CREATE',
      actionType: 'CREATE',
      content: '',
    })

    setIsUpdateMode(true)
    setIsUpdated(true)
  }

  const handleContentChange = (id: string | number, content: string) => {
    setLocalContents((prev) => ({
      ...prev,
      [id]: content,
    }))
  }

  const handleAddItem = (index: number) => {
    const currentItem = items[index]
    const content = localContents[currentItem.id] || ''

    if (content.trim()) {
      const itemIndex = items.findIndex((item) => item.id === currentItem.id)
      if (itemIndex !== -1) {
        update(itemIndex, {
          ...currentItem,
          content,
          variant: 'DEFAULT',
          actionType:
            currentItem.actionType === 'CREATE' ? 'CREATE' : 'DEFAULT',
        })
        setLocalContents((prev) => {
          const newState = { ...prev }
          delete newState[currentItem.id]
          return newState
        })
        setIsUpdated(true)
      }
    }
  }

  const handleUpdateConfirm = (index: number) => {
    const currentItem = items[index]
    const content = localContents[currentItem.id] || currentItem.content

    if (content.trim()) {
      update(index, {
        ...currentItem,
        content,
        variant: 'DEFAULT',
        actionType: 'UPDATE',
      })
      setLocalContents((prev) => {
        const newState = { ...prev }
        delete newState[currentItem.id]
        return newState
      })
      setIsUpdated(true)
    }
  }

  const handleConfirmClick = () => {
    if (isUpdated && isUpdateMode) {
      setIsModalOpen(true)
    }
  }

  const handleModalConfirm = async () => {
    setIsModalOpen(false)

    const updates = items.map((item) => ({
      id: Number(item.id),
      content: item.content.trim(),
      category: item.rule.category,
      actionType: item.actionType,
    }))

    try {
      const filteredUpdates = updates.filter(
        (update) => update.actionType !== 'DEFAULT',
      )
      console.log('filteredUpdates', filteredUpdates) // 수정요청보내는거 콘솔찍기
      const response = await updateLifeRule({ updates: filteredUpdates })

      console.log(updates)
      if (response.success) {
        router.push('/lifeRule')
        dispatch(setHomeOverviewLifeRuleApproved(true))
      }
    } catch (error) {
      console.error('Error updating life rules:', error)
    }
  }

  return (
    <Container>
      <TopHeader title={t('lifeRule.updateTitle')} />
      <FormProvider {...methods}>
        <FullMain>
          <LifeRuleUpdateList>
            {fields.map((field, index) => {
              const item = items[index]
              const localContent = localContents[item.id]
              return (
                <LifeRuleUpdateListItem
                  key={field.fieldId}
                  lifeRule={item.rule}
                  variant={item.variant}
                  content={
                    localContent !== undefined ? localContent : item.content
                  }
                  setVariant={(variant) =>
                    handleVariantChange(item.id, variant)
                  }
                  onContentChange={(content) =>
                    handleContentChange(item.id, content)
                  }
                  onAddItem={handleAddItem}
                  onUpdateConfirm={() => handleUpdateConfirm(index)}
                  index={index}
                />
              )
            })}
          </LifeRuleUpdateList>

          <Image
            onClick={handleCreateNew}
            src="/images/lifeRule/create.svg"
            alt="create"
            width={46}
            height={46}
          />
        </FullMain>
      </FormProvider>

      <ConfirmContainer>
        <ConfirmButton
          label="완료"
          variant={isUpdated && isUpdateMode ? 'next' : 'disabled'}
          onClick={handleConfirmClick}
        />
      </ConfirmContainer>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleModalConfirm}
        title={t('lifeRule.updateModal.title')}
        description={t('lifeRule.updateModal.description')}
        confirmText={t('lifeRule.updateModal.confirmText')}
      />
    </Container>
  )
}

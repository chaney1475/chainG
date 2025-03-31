'use client'

import React, { useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { getUpdateLifeRule, updateLifeRule } from '@/apis/lifeRule'
import { ConfirmButton } from '@/components/ConfirmButton'
import Modal from '@/components/Modal'
import { TopHeader } from '@/components/TopHeader'
import { lifeRuleList } from '@/constants/lifeRuleList'
import { useAppSelector } from '@/hooks/useAppSelector'
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
    rule?: LifeRule
  }>
}

export function LifeRuleUpdatePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const lifeRules = useAppSelector((state) => state.lifeRule.lifeRules)

  const methods = useForm<FormValues>({
    defaultValues: {
      items: lifeRules.map((rule) => ({
        id: rule.id,
        variant: rule.actionType as LifeRuleUpdateVariant,
        actionType: rule.actionType as LifeRuleUpdateVariant,
        content: rule.content,
      })),
    },
  })

  const { fields, append, update } = useFieldArray({
    control: methods.control,
    name: 'items',
  })

  const items = methods.watch('items')
  const [isUpdated, setIsUpdated] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)

  useEffect(() => {
    if (lifeRules?.lifeRules?.length > 0) {
      methods.setValue(
        'items',
        lifeRules.lifeRules.map((rule: LifeRule, index: number) => ({
          id: index,
          rule,
          variant: 'DEFAULT' as LifeRuleUpdateVariant,
          actionType: 'DEFAULT' as LifeRuleUpdateVariant,
          content: '',
        })),
      )
    }
  }, [lifeRules?.lifeRules, methods])

  const handleVariantChange = (
    id: number,
    newVariant: LifeRuleUpdateVariant,
  ) => {
    console.log(' id', id, 'newVariant', newVariant)
    const itemIndex = items.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
      update(itemIndex, {
        ...items[itemIndex],
        variant: newVariant,
      })
      setIsUpdateMode(true)
      setIsUpdated(true)
    }
  }

  const handleCreateNew = () => {
    append({
      id: items.length,
      rule: lifeRuleList[0],
      variant: 'CREATE' as LifeRuleUpdateVariant,
      actionType: 'CREATE' as LifeRuleUpdateVariant,
      content: '',
    })
    setIsUpdateMode(true)
    setIsUpdated(true)
  }

  const handleAddItem = (index: number) => {
    console.log(' handleAddItem index', index, items)
    const currentItem = items[index]
    if (currentItem.content.trim()) {
      const itemIndex = items.findIndex((item) => item.id === currentItem.id)
      if (itemIndex !== -1) {
        update(itemIndex, {
          ...currentItem,
          variant: 'DEFAULT',
        })
        setIsUpdated(true)
      }
    }
  }

  const handleContentChange = (id: number, content: string) => {
    const itemIndex = items.findIndex((item) => item.id === id)
    if (itemIndex !== -1) {
      const currentItem = items[itemIndex]
      update(itemIndex, {
        ...currentItem,
        content,
      })
      setIsUpdated(true)
    }
  }

  const handleConfirmClick = () => {
    console.log('items', items)
    if (isUpdated && isUpdateMode) {
      setIsModalOpen(true)
    }
  }

  const handleModalConfirm = async () => {
    setIsModalOpen(false)
    console.log('items', items)

    const updatedItems = items.map((item) => ({
      content: item.content,
      category: item.rule?.category || '',
      actionType: item.actionType,
    }))

    console.log('updatedItems', updatedItems)

    const response = await updateLifeRule(updatedItems)
    console.log('response', response)
    if (response.success) {
      router.push('/lifeRule/updateApprove')
    }
  }

  return (
    <Container>
      <TopHeader title={t('lifeRule.updateTitle')} />
      <FormProvider {...methods}>
        <FullMain>
          {'이동현씨의 역작 '}
          <LifeRuleUpdateList>
            {fields.map((field, index) => (
              <LifeRuleUpdateListItem
                key={field.id}
                lifeRule={field.rule || lifeRuleList[0]}
                variant={field.variant}
                actionType={field.actionType}
                setVariant={(variant) => handleVariantChange(field.id, variant)}
                onContentChange={(content) =>
                  handleContentChange(field.id, content)
                }
                onAddItem={handleAddItem}
                index={index}
              />
            ))}
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

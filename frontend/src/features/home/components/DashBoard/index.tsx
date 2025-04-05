'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import {
  DefaultContainer,
  SlimContainer,
  Title,
  TitleContainer,
} from '@/styles/styles'

import {
  Card,
  CardContainer,
  Category,
  Description,
  IssueContainer,
  IssueContent,
  StyledButton,
} from './styles'

interface Issue {
  category: string
  title: string
  description: string
}

export function DashBoard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [dutyIssues, setDutyIssues] = useState<Issue[]>([])
  const [rentIssues, setRentIssues] = useState<Issue[]>([])
  const [utilityIssues, setUtilityIssues] = useState<Issue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    // 모든 이슈를 한 번에 추가
    const initialIssues: Issue[] = [
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '월세 미납 시 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '월세 납부 전날 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '월세 미납 여부 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '월세 납부일 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '공과급 미납 시 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '공과금 계좌로 납부 전날 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '공과금 납부일 안내',
      },
      {
        category: 'rent',
        title: '미납 납부하기',
        description: '오늘 나의 당번 안내',
      },
    ]

    setIssues(initialIssues)
  }, [])

  useEffect(() => {
    setDutyIssues(issues.filter((issue) => issue.category === 'duty'))
    setRentIssues(issues.filter((issue) => issue.category === 'rent'))
    setUtilityIssues(issues.filter((issue) => issue.category === 'utility'))
  }, [issues])

  useEffect(() => {
    switch (selectedCategory) {
      case 'duty':
        setSelectedIssue(dutyIssues)
        break
      case 'rent':
        setSelectedIssue(rentIssues)
        break
      case 'utility':
        setSelectedIssue(utilityIssues)
        break
      default:
        setSelectedIssue(issues)
        break
    }
  }, [selectedCategory])

  return (
    <DefaultContainer>
      {issues.length != 0 && (
        <>
          <DefaultContainer>
            <Title>오늘 나의 이슈</Title>
            <SlimContainer>
              <div>
                {issues.length != 0 && (
                  <StyledButton
                    isSelected={selectedCategory === 'all'}
                    onClick={() => setSelectedCategory('all')}>
                    전체
                  </StyledButton>
                )}
                {dutyIssues.length != 0 && (
                  <StyledButton
                    isSelected={selectedCategory === 'duty'}
                    onClick={() => setSelectedCategory('duty')}>
                    당번
                  </StyledButton>
                )}
                {rentIssues.length != 0 && (
                  <StyledButton
                    isSelected={selectedCategory === 'rent'}
                    onClick={() => setSelectedCategory('rent')}>
                    월세
                  </StyledButton>
                )}
                {utilityIssues.length != 0 && (
                  <StyledButton
                    isSelected={selectedCategory === 'utility'}
                    onClick={() => setSelectedCategory('utility')}>
                    공과금
                  </StyledButton>
                )}
              </div>
            </SlimContainer>
            <TitleContainer>
              {selectedIssue.map((issue) => (
                <IssueContainer key={issue.title}>
                  <Image
                    src={`/images/home/home-${issue.category === 'duty' ? 'duty' : 'unpaid'}.png`}
                    alt={`${issue.category} 이미지`}
                    width={50}
                    height={50}
                  />
                  <IssueContent>
                    <Category>{issue.category}</Category>
                    <Title>{issue.title}</Title>
                    <Description>{issue.description}</Description>
                  </IssueContent>
                </IssueContainer>
              ))}
            </TitleContainer>
          </DefaultContainer>
          <DefaultContainer>
            <Title>생활 관리</Title>
            <CardContainer>
              <Card href="/lifeRule">
                생활 규칙
                <Image
                  src={'/images/home/home-life-rule.png'}
                  alt="생활 규칙"
                  width={50}
                  height={50}
                />
              </Card>
              <Card href="/duty">
                당번
                <Image
                  src={'/images/home/home-duty.png'}
                  alt="당번"
                  width={50}
                  height={50}
                />
              </Card>
            </CardContainer>
          </DefaultContainer>
        </>
      )}
    </DefaultContainer>
  )
}

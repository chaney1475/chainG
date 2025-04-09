import { useEffect, useRef, useState } from 'react'

import Flicking from '@egjs/react-flicking'
import '@egjs/react-flicking/dist/flicking.css'

import { Image } from '@/components'

import {
  Card,
  Desc,
  Dot,
  ImageWrapper,
  StepControl,
  Title,
  Wrapper,
} from './styles'

const cardItems = [
  {
    url: '/group/create',
    image: '/images/onboarding/onboarding-blockchain.png',
    title: '그룹 만들기',
    description: '새로운 그룹을 만들어요',
  },
  {
    url: '/group/join',
    image: '/images/onboarding/onboarding-transfer.png',
    title: '그룹 참여하기',
    description: '초대받은 그룹에 참여해요',
  },
]

export function StartPage() {
  const flickingRef = useRef<Flicking | null>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const flicking = flickingRef.current
    if (!flicking) return

    if (flicking.index !== step) {
      flicking.moveTo(step)
    }
  }, [step])

  return (
    <Wrapper>
      <Flicking
        ref={flickingRef}
        align="center"
        onChanged={(e) => setStep(e.index)}
        panelsPerView={1}>
        {cardItems.map((item, idx) => (
          <Card key={idx}>
            <ImageWrapper>
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{ objectFit: 'contain' }}
              />
            </ImageWrapper>
            <Title>{item.title}</Title>
            <Desc>{item.description}</Desc>
          </Card>
        ))}
      </Flicking>

      <StepControl>
        {cardItems.map((_, i) => (
          <Dot
            key={i}
            active={i === step}
            onClick={() => setStep(i)}
          />
        ))}
      </StepControl>
    </Wrapper>
  )
}

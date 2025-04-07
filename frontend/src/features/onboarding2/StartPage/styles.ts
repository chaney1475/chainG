import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
`

export const Card = styled.div`
  background: #f7f7f7;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem 1.5rem;
  text-align: center;
`

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  margin-bottom: 1rem;
`

export const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

export const Desc = styled.p`
  font-size: 0.95rem;
  color: #666;
`

export const StepControl = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`

export const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#4A90E2' : '#ccc')};
  border: none;
  cursor: pointer;
  transition: background 0.3s;
`

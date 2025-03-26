import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  height: 100vh;
`
export const BottomContainer = styled.div`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
`

export const Main = styled.main`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 60%;
  gap: 60px;
  width: 100%;
`
export const Form = styled.form`
  width: 100%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
`

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  height: 100vh;
`

export const mainStyle = css`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import theme from '@/styles/themes'

export const overlayStyle = css`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`

export const bottomSheetStyle = css`
  background: white;
  border-radius: 16px;
  width: 90vw;
  position: fixed;
  bottom: 0;
  min-height: 30vh;
  z-index: 1001;
  word-break: keep-all;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const titleStyle = css`
  font-size: 16px;
  font-weight: bold;
  margin: 16px 0;
  color: ${theme.color.text.regular};
  ${theme.typography.styles.title}
  text-align: center;
`

export const descStyle = css`
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
  color: ${theme.color.text.low};
  line-height: 1.5;
  width: 80%;
  margin: 0 auto;
  ${theme.typography.styles.default}
`

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex: 0;
  padding: 0 16px;
  width: 100%;
  justify-content: space-between;
  button {
    flex: 1;
  }
`

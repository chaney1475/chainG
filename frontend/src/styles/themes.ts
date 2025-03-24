// theme.ts
import '@emotion/react'

export type CustomTheme = {
  color: {
    primary: string
    secondary: string
    text: {
      regular: string
      low: string
      disabled: string
      distructive: string
      confirm: string
    }
    border: string
  }
  typography: {
    fonts: {
      paperlogyRegular: string
      paperlogyMedium: string
    }
    styles: {
      name: {
        fontFamily: string
        fontSize: string
      }
      inputBoxTitle: {
        fontFamily: string
        fontSize: string
      }
      default: {
        fontFamily: string
        fontSize: string
      }
    }
  }
}

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}

const theme: CustomTheme = {
  color: {
    primary: '#5583e7',
    secondary: '#f1f3f6',
    text: {
      regular: '#1f1f1f',
      low: '#4f4f4f',
      disabled: '#8c8c8c',
      distructive: '#c84620',
      confirm: '#3bce6e',
    },
    border: '#d9d9d9',
  },
  typography: {
    fonts: {
      paperlogyRegular: 'var(--font-paperlogy-regular)',
      paperlogyMedium: 'var(--font-paperlogy-medium)',
    },
    styles: {
      name: {
        fontFamily: 'var(--font-paperlogy-regular)',
        fontSize: '0.875rem', // 14px를 rem으로 변환 (14/16)
      },
      inputBoxTitle: {
        fontFamily: 'var(--font-paperlogy-medium)',
        fontSize: '0.875rem', // 14px를 rem으로 변환 (14/16)
      },
      default: {
        fontFamily: 'var(--font-paperlogy-regular)',
        fontSize: '1.125 rem',
      },
    },
  },
}

export default theme

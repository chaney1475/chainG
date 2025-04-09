'use client'

import { useState } from 'react'

import NextImage, { ImageProps as NextImageProps } from 'next/image'

interface ImageProps extends NextImageProps {
  errorSrc?: string
}

export const Image = ({
  src,
  alt = '',
  width = 80,
  height = 80,
  errorSrc = '/images/lifeRule/life-rule-OTHER-inactive.svg',
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)

  const handleImageError = () => {
    setImgSrc(errorSrc)
  }

  return (
    <NextImage
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={handleImageError}
      unoptimized={true}
    />
  )
}

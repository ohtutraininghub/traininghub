'use-client';

import theme from '../Providers/ThemeRegistry/theme';
import Image from 'next/image';

interface Props {
  imageUrl: string;
  width: number;
  height: number;
  altText: string;
  withBorder?: boolean;
}

export function ImageContainer({
  imageUrl,
  width,
  height,
  altText,
  withBorder = false,
}: Props) {
  return (
    <Image
      data-testid="courseImage"
      style={{
        alignSelf: 'center',
        margin: '1rem 0 1rem 0',
        border: withBorder
          ? `1px solid ${theme.palette.coverBlue.dark}`
          : 'none',
        borderRadius: '4px',
        padding: '1rem',
      }}
      src={`${imageUrl}`}
      width={width}
      height={height}
      alt={altText}
    />
  );
}

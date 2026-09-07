import { tv, type VariantProps } from 'tailwind-variants';

export const avatarStyle = tv({
  base: 'bg-avatar-bg shirnk-0 overflow-hidden',
  variants: {
    size: {
      xs: 'avatar-xs text-xs',
      sm: 'avatar-sm text-sm',
      md: 'avatar-md text-base',
      lg: 'avatar-lg text-base',
    },
    border: {
      true: 'border border-solid border-avatar-border',
      false: 'border-none',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type AvatarThemeProps = VariantProps<typeof avatarStyle>;

import { tv, type VariantProps } from 'tailwind-variants';

export const avatarStyle = tv({
  base: 'bg-avatar-bg border border-solid border-avatar-border shirnk-0',
  variants: {
    size: {
      xs: 'avatar-xs',
      sm: 'avatar-sm',
      md: 'avatar-md',
      lg: 'avatar-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type AvatarThemeProps = VariantProps<typeof avatarStyle>;

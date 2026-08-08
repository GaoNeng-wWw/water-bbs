import { tv, type VariantProps } from 'tailwind-variants';

export const skeletonStyle = tv({
  base: 'bg-skeleton-bg shrink-0',
  variants: {
    size: {
      xs: 'h-form-xs w-full',
      sm: 'h-form-sm w-full',
      md: 'h-form-md w-full',
      lg: 'h-form-lg w-full',
    },
    rounded: {
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    animated: {
      true: 'skeleton-shimmer',
    },
  },
  defaultVariants: {
    size: 'md',
    rounded: 'md',
    animated: true,
  },
});

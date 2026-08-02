import { tv } from 'tailwind-variants';

export const popoverContentStyle = tv({
  base: ['border border-solid border-surface-200 bg-surface-100 max-h-(--reka-popover-content-available-height) overflow-auto',],
  variants: {
    widthFollowTrigger: {
      true: 'min-w-(--reka-popover-trigger-width)',
    },
    rounded: {
      xs: 'rounded-xs px-component-xs',
      sm: 'rounded-sm px-component-sm py-1',
      md: 'rounded-md px-component-md py-1',
      lg: 'rounded-lg px-component-lg py-1',
    },
  },
});

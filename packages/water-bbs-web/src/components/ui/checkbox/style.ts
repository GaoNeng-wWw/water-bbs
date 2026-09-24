import { tv } from 'tailwind-variants';

export const checkbox = tv({
  variants: {
    size: {
      sm: {
        base: 'size-checkbox-sm rounded-xs',
        icon: 'size-checkbox-sm',
        indicator: 'size-full rounded-sm flex items-center justify-center',
      },
      md: {
        base: 'size-checkbox-md rounded-sm',
        icon: 'size-checkbox-md',
        indicator: 'size-full rounded-md flex items-center justify-center',
      },
      lg: {
        base: 'size-checkbox-lg rounded-md',
        icon: 'size-checkbox-lg',
        indicator: 'size-full rounded-lg flex items-center justify-center',
      },
    },
  },
  slots: {
    base: 'inline-flex cursor-pointer items-center justify-center bg-surface-50 hover:bg-surface-100',
    indicator: 'bg-surface-50 hover:bg-surface-100',
    icon: 'text-primary-500',
  },
});

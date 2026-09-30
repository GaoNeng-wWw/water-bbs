import { tv, type VariantProps } from 'tailwind-variants';

export const buttonStyle = tv({
  base: 'outline-none inline-flex items-center justify-center transition-all duration-fast cursor-pointer shrink-0',
  variants: {
    color: {
      surface: '',
      primary: '',
      danger: '',
      success: '',
      warning: '',
    },
    variant: {
      solid: '',
      outline: 'border border-solid',
      ghost: '',
      text: '',
      flat: '',
    },
    size: {
      xs: 'h-form-xs px-component-xs rounded-xs text-xs',
      sm: 'h-form-sm px-component-sm rounded-sm text-sm',
      md: 'h-form-md px-component-md rounded-md text-base',
      lg: 'h-form-lg px-component-lg rounded-lg text-lg',
      full: 'h-form-md w-full text-base rounded-md',
    },
    icon: {
      true: 'aspect-square px-0!',
    },
    disabled: {
      true: 'pointer-events-none opacity-50',
    },
    loading: {
      true: 'pointer-events-none opacity-50',
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'solid', className: 'bg-btn-solid-primary-bg text-btn-solid-primary-text hover:bg-btn-solid-primary-hover' },
    { color: 'surface', variant: 'solid', className: 'bg-btn-solid-surface-bg text-btn-solid-surface-text hover:bg-btn-solid-surface-hover' },
    { color: 'danger', variant: 'solid', className: 'bg-btn-solid-danger-bg text-btn-solid-danger-text hover:bg-btn-solid-danger-hover' },
    { color: 'success', variant: 'solid', className: 'bg-btn-solid-success-bg text-btn-solid-success-text hover:bg-btn-solid-success-hover' },
    { color: 'warning', variant: 'solid', className: 'bg-btn-solid-warning-bg text-btn-solid-warning-text hover:bg-btn-solid-warning-hover' },

    { color: 'primary', variant: 'outline', className: 'border-btn-outline-primary text-btn-outline-primary-text' },
    { color: 'surface', variant: 'outline', className: 'border-btn-outline-surface text-btn-outline-surface-text' },
    { color: 'danger', variant: 'outline', className: 'border-btn-outline-danger text-btn-outline-danger-text' },
    { color: 'success', variant: 'outline', className: 'border-btn-outline-success text-btn-outline-success-text' },
    { color: 'warning', variant: 'outline', className: 'border-btn-outline-warning text-btn-outline-warning-text' },

    { color: 'primary', variant: 'flat', className: 'text-btn-ghost-primary-hovered-text bg-btn-ghost-primary-bg/50' },
    { color: 'surface', variant: 'flat', className: 'text-btn-ghost-surface-hovered-text bg-btn-ghost-surface-bg/50' },
    { color: 'danger', variant: 'flat', className: 'text-btn-ghost-danger-hovered-text bg-btn-ghost-danger-bg/50' },
    { color: 'success', variant: 'flat', className: 'text-btn-ghost-success-hovered-text bg-btn-ghost-success-bg/50' },
    { color: 'warning', variant: 'flat', className: 'text-btn-ghost-warning-hovered-text bg-btn-ghost-warning-bg/50' },

    { color: 'primary', variant: 'ghost', className: 'text-btn-ghost-primary-text hover:text-btn-ghost-primary-hovered-text hover:bg-btn-ghost-primary-bg/50' },
    { color: 'surface', variant: 'ghost', className: 'text-btn-ghost-surface-text hover:text-btn-ghost-surface-hovered-text hover:bg-btn-ghost-surface-bg/50' },
    { color: 'danger', variant: 'ghost', className: 'text-btn-ghost-danger-text hover:text-btn-ghost-danger-hovered-text hover:bg-btn-ghost-danger-bg/50' },
    { color: 'success', variant: 'ghost', className: 'text-btn-ghost-success-text hover:text-btn-ghost-success-hovered-text hover:bg-btn-ghost-success-bg/50' },
    { color: 'warning', variant: 'ghost', className: 'text-btn-ghost-warning-text hover:text-btn-ghost-warning-hovered-text hover:bg-btn-ghost-warning-bg/50' },

    { color: 'primary', variant: 'text', className: 'text-btn-solid-primary-bg' },
    { color: 'surface', variant: 'text', className: 'text-btn-solid-surface-bg' },
    { color: 'danger', variant: 'text', className: 'text-btn-solid-danger-bg' },
    { color: 'success', variant: 'text', className: 'text-btn-solid-success-bg' },
    { color: 'warning', variant: 'text', className: 'text-btn-solid-warning-bg' },
  ],
  defaultVariants: {
    size: 'md', color: 'surface', loading: false, disabled: false, variant: 'solid',
  },
});

export type ButtonProps = VariantProps<typeof buttonStyle>;

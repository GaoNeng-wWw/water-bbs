export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
} | {
  label: string;
  disabled?: boolean;
  children: Option[];
};

export type SelectProps = {
  options: Option[];
  deafultSelect?: string;
  multiple?: boolean;
  fit?: boolean;
};

export type SkeletonProps = {
  /**
   * @description 自定义宽度，会覆盖 size 预设的宽度
   */
  width?: string;
  /**
   * @description 自定义高度，会覆盖 size 预设的高度
   */
  height?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | undefined;
  rounded?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | undefined;
  animated?: boolean | undefined;
};
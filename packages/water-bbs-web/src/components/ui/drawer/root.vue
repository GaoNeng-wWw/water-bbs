<script lang="ts" setup>
import { provideContext } from '@/utils';
import { DrawerRoot } from 'vaul-vue';
import { drawerContextKey, type DrawerProps } from './context.prop';
import { computed, inject, ref } from 'vue';

const { direction = 'bottom' } = defineProps<DrawerProps>();
const emits = defineEmits<{ animationEnd: [boolean] }>();
const modelValue = defineModel<boolean>({ default: false });
const activeSnapPoints = defineModel<(string|number|null)>('activeSnapPoints',{required: false, default: null});

const hasParent = inject(drawerContextKey)?.hasParent;
const dir = ref(direction);

provideContext(drawerContextKey, {
  hasParent: true,
  direction: computed(() => dir.value),
  setDirection: (d) => {
    dir.value = d;
  },
});

const onAnimationEnd = (open: boolean) => {
  emits('animationEnd', open);
};
const onActiveSnapPointUpdate = (val: string | number | null) => {
  if (!val) {
    modelValue.value = false;
  }
  activeSnapPoints.value = val;
}
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <drawer-root
    :open="modelValue"
    :active-snap-point="activeSnapPoints"
    :snap-points="direction !== 'bottom' && direction !== 'top' ? undefined : snapPoints"
    :direction="dir"
    should-scale-background
    :nestd="hasParent"
    @animation-end="onAnimationEnd"
    @update:open="(val) => modelValue = val"
    @update:active-snap-point="onActiveSnapPointUpdate"
  >
    <slot :direction="dir" />
  </drawer-root>
</template>

<script lang="ts" setup>
import { useDrawer } from '@/composables/use-drawer.ts';
import Content from './content.vue';
import Root from './root.vue';

const { drawer, onExit, close } = useDrawer();

const closeDrawer = (id: number, data?: any) => {
  close(id, data);
  onExit(id);
};
const onAnimationEnd = (id: number, open: boolean) => {
  if (open) {
    return;
  }
  close(id);
  onExit(id);
};
const onValueChange = (id: number, val: boolean) => {
  if (val) {
    return;
  }
  close(id);
};
</script>

<template>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <slot />
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <root
    v-for="d in drawer"
    :key="d.id"
    :active-snap-points="d.activeSnapPoints"
    :model-value="d.show"
    :direction="d.direction"
    :snap-points="d.snapPoints"
    @update:active-snap-points="(val) => {
      d.activeSnapPoints = val;
    }"
    @update:model-value="(val) => onValueChange(d.id, val)"
    @animation-end="(open) => onAnimationEnd(d.id, open)"
  >
    <content>
      <component :is="d.comp" @close="() => closeDrawer(d.id)" />
    </content>
  </root>
</template>

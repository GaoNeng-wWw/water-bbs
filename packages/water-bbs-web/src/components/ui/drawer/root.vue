<script lang="ts" setup>
import { provideContext } from '@/utils';
import { DrawerRoot, DrawerRootNested } from 'vaul-vue';
import { drawerContextKey } from './context.prop';
import { inject } from 'vue';

const modelValue = defineModel<boolean>({ default: false });

const hasParent = inject(drawerContextKey)?.hasParent;

provideContext(drawerContextKey, {
  hasParent: true,
});

const comp = hasParent ? DrawerRootNested : DrawerRoot;
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-model-argument -->
  <component :is="comp" v-model:open="modelValue">
    <slot />
  </component>
</template>

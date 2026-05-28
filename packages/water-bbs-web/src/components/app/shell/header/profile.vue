<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import { useSiteStore } from '@/store/site.store';
import AccountCard from '../../account/account-card.vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useDrawer } from '@/composables';
import { h } from 'vue';
import Sidebar from '../sidebar.vue';

const siteStore = useSiteStore();
const screen = useBreakpoints(breakpointsTailwind);
const {render} = useDrawer();

const onClickMenuIcon = () => {
  if (!screen.isSmaller('md')) {
    siteStore.onClickMenuIcon();
  }
  render(
    h('div', { class: 'w-[200px] h-full overflow-auto' }, [h(Sidebar)]), { direction: 'left' },
  );
}

</script>

<template>
  <div class="w-full h-full flex items-center justify-between max-w-3xl mx-auto">
    <div class="flex w-fit h-full">
      <ui-button icon size="sm" @click="onClickMenuIcon">
        <div class="i-material-symbols:menu size-7 text-warm-foreground" />
      </ui-button>
    </div>
    <div class="w-fit">
      <account-card />
    </div>
  </div>
</template>

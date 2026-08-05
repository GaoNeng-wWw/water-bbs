<script lang="ts" setup>
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui';
import { computed, useTemplateRef, watch } from 'vue';
import { useShadowScroll } from './use-shadow-scroll';

const { horizontal = false } = defineProps<{
  horizontal?: boolean;
}>();

const mode = computed(() => horizontal ? 'horizontal' : 'vertical');
const scrollAreaViewPort = useTemplateRef('scroll-area');
const { state } = useShadowScroll({ mode, el: computed(() => scrollAreaViewPort.value?.viewport) });
watch(state, () => {
  console.log(state.value);
});
</script>

<template>
  <scroll-area-root ref="scroll-area" class="scroll" :data-scroll-state="state" :data-direction=" horizontal ? 'horizontal' : 'vertical'">
    <scroll-area-scrollbar orientation="vertical" class="scroll__bar scroll__bar--vertical outline-none border-none">
      <scroll-area-thumb class="scroll__bar__thumb" />
    </scroll-area-scrollbar>
    <scroll-area-scrollbar v-if="horizontal" orientation="horizontal" class="scroll__bar scroll__bar--horizontal">
      <scroll-area-thumb class="scroll__bar__thumb" />
    </scroll-area-scrollbar>
    <scroll-area-viewport as-child as="div" class="size-full">
      <slot />
    </scroll-area-viewport>
  </scroll-area-root>
</template>

<style scoped>
@reference "tailwindcss";
@reference "../../../assets/style.css";
.scroll {
  @apply w-full overflow-hidden;

  --scroll-shadow-size: 40px;
  --scrollbar-size: 10px;
  --scroll-shadow: transparent, black var(--scroll-shadow-size), black calc(100% - var(--scroll-shadow-size)), transparent;
  --scroll-shadow-direction: to bottom;
  &[data-direction="horizontal"] {
    --scroll-shadow-direction: to right;
  }
  &[data-scroll-state="end"] {
    --scroll-shadow: linear-gradient(
      var(--scroll-shadow-direction),
      black calc(100% - var(--scroll-shadow-size)), transparent
    );
  }
  &[data-scroll-state="mid"] {
    --scroll-shadow: linear-gradient(
      var(--scroll-shadow-direction),
      transparent, black var(--scroll-shadow-size), black calc(100% - var(--scroll-shadow-size)), transparent
    );
  }
  &[data-scroll-state="start"] {
    --scroll-shadow: linear-gradient(
      var(--scroll-shadow-direction),
      transparent, black var(--scroll-shadow-size)
    );
  }
  mask-image: var(--scroll-shadow);
  mask-position: left top;
}

.scroll__bar {
  @apply flex select-none touch-none p-0.5 bg-surface-100 transition-all ease-in-out duration-normal cursor-pointer rounded-md;
  width: var(--scrollbar-size);
  &:hover {
    @apply bg-surface-200;
  }
  &[data-orientation="vertical"] {
    width: var(--scrollbar-size);
  }
  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: var(--scrollbar-size);
  }
}
.scroll__bar__thumb {
  @apply relative flex-1 bg-surface-300 rounded-(--scrollbar-size);
  &::before {
    @apply content-[''] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full min-w-form-md min-h-form-md;
  }
}
</style>

<script lang="ts" setup>
import { motion, type MotionHTMLAttributes } from 'motion-v';
import { ref } from 'vue';

type ImageProps = {
  src: string;
  lightbox?: boolean;
};

const props = defineProps<ImageProps>();

const active = ref(false);
const toggleActive = () => {
  if (!props.lightbox) {
    return;
  }
  active.value = !active.value;
};
const close = () => {
  active.value = false;
};
</script>

<template>
  <motion.div class="w-fit">
    <motion.img
      :layout-id="`layout-${props.src}`"
      v-bind="props"
      layout
      :data-active="active ? true : undefined"
      @click="toggleActive"
    />
    <Teleport to="body">
      <motion.img
        v-if="active"
        :layout-id="`layout-${props.src}`"
        v-bind="props"
        layout
        class="fixed max-w-600px w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-200"
      />
      <motion.div v-if="active" class="fixed size-full bg-black/50 inset-0 z-10" @click="close" />
    </Teleport>
  </motion.div>
</template>

<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v';
import { provideContext, type TabRootEmits, type TabsProps } from './props';
import { computed, reactive, ref, type Ref, type VNode } from 'vue';
import { UiShadowScroll } from '../shadow-scroll';

const { defaultActvie, disabled = [], lazy = true } = defineProps<TabsProps>();
const emits = defineEmits<TabRootEmits>();

type HeaderItem = {
  id: string;
  label: string;
  disabled: boolean;
};
const curActive: Ref<string | null> = ref(defaultActvie ?? '');
const headers: Ref<HeaderItem[]> = ref([]);
const disabledKey = reactive(new Set(disabled));
const vnodeMap = reactive(new Map<string, () => VNode[]>());

const onClick = (id: string) => {
  if (disabled.includes(id)) {
    return;
  }
  curActive.value = id;
};

const onMounted = (id: string, label: string, slot: () => VNode[], disabledRewrite: boolean) => {
  vnodeMap.set(id, slot);
  if (disabledRewrite) {
    disabledKey.add(id);
  }
  const idx = headers.value.findIndex(header => header.id === id);
  if (idx === -1) {
    headers.value.push({ id, label, disabled: disabledKey.has(id) });
  }
  const isDisabled = disabledKey.has(id);
  if (!curActive.value && !isDisabled) {
    curActive.value = id;
  }
};

const comp = computed(() => curActive.value ? vnodeMap.get(curActive.value!) ?? null : null);

provideContext({
  active: computed(() => curActive.value),
  onMounted,
});
</script>

<template>
  <motion.div>
    <motion.div>
      <animate-presence mode="wait">
        <ui-shadow-scroll horizontal>
          <ul class="flex gap-3 w-fit">
            <li
              v-for="item in headers"
              :key="item.id"
              class="
                text-surface-fg cursor-pointer relative px-2 py-0.5 min-h-form-sm flex flex-col items-center justify-center rounded-md
                data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-surface-fg/50 data-[disabled=true]:pointer-events-none
              "
              :data-disabled="disabledKey.has(item.id)"
              :data-active="curActive === item.id"
              @click="onClick(item.id)"
            >
              <motion.div
                v-if="curActive === item.id"
                layout-id="thumb"
                layout
                class="w-full h-full bg-surface-100 rounded-md absolute top-0 left-0"
              />
              <span class="relative z-1">{{ item.label }}</span>
            </li>
          </ul>
        </ui-shadow-scroll>
      </animate-presence>
    </motion.div>
    <motion.div>
      <div v-show="false">
        <slot />
      </div>
      <component :is="comp" v-if="lazy" />
      <template v-else>
        <div v-for="item in headers" v-show="curActive === item.id" :key="item.id">
          <component :is="vnodeMap.get(item.id)" />
        </div>
      </template>
    </motion.div>
  </motion.div>
</template>

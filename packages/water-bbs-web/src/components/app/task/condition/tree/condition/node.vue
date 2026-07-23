<script lang="ts" setup>
import { UiCollapse, UiCollapseItem, UiSelect } from '@/components/ui';
import type { ConditionKind } from '@/composables';
import headerMeta from './header-meta.vue';
import { ref, watch, type Ref } from 'vue';
const { id, label, updateCondition, facts = [] } = defineProps<{
  id: string;
  label: string;
  updateCondition: (id: string, newCondition: ConditionKind) => void;
  facts: string[];
}>();

const emits = defineEmits<{ select: ['condition' | 'fact', string, string]; remove: [string] }>();

const conditions = ['any', 'all', 'not']
  .map((condition) => {
    return {
      label: condition,
      value: condition,
    };
  });

const currentCondition = ref<ConditionKind>(label as ConditionKind);
const factOptions: Ref<{ label: string; value: string }[]> = ref([]);

factOptions.value = facts.map((data) => {
  return {
    label: data,
    value: data,
  };
});

const onSelect = (value: string) => {
  emits('select', conditions.find(cond => cond.value === value) ? 'condition' : 'fact', value, id);
};
const onRemove = (id: string) => {
  emits('remove', id);
};

watch(currentCondition, () => {
  updateCondition(id, currentCondition.value);
});
</script>

<template>
  <div class="w-full">
    <ui-collapse>
      <ui-collapse-item :id="id" :label="label">
        <template #header="{ click, active }">
          <div class="w-full h-fit flex  items-center justify-between pl-2 pr-4 py-1 text-warm-foreground" @click="click()">
            <div class="w-fit flex items-center gap-4">
              <div
                :data-active="active"
                class="size-4 transition duration-fast ease-in-out i-material-symbols:arrow-forward-ios-rounded data-[active='true']:rotate-90"
              />
              <div class="w-fit">
                <ui-select v-model="currentCondition" :options="conditions" />
              </div>
            </div>
            <header-meta
              :id="id"
              :options="[
                {
                  label: 'condition',
                  children: [
                    { label: 'any', value: 'any' },
                    { label: 'all', value: 'all' },
                    { label: 'not', value: 'not' },
                  ],
                },
                {
                  label: 'fact',
                  children: factOptions,
                },
              ]"
              @select="onSelect"
              @remove="onRemove"
            />
          </div>
        </template>
        <div class="pr-4 flex text-warm-foreground mt-2">
          <div class="size-6" />
          <div class="grow">
            <slot />
          </div>
        </div>
      </ui-collapse-item>
    </ui-collapse>
  </div>
</template>

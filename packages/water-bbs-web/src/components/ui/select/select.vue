<script lang="ts" setup>
import { Select } from 'reka-ui/namespaced';
import { SelectValue } from 'reka-ui';
import type { SelectProps } from './select.props';
import { UiInput } from '@/components/ui';
import { ref, watch } from 'vue';
import SelectList from './select-list.vue';

const props = defineProps<SelectProps>();
const modelValue = defineModel<string | string[]>();
const selected = ref(modelValue.value);
watch(selected, () => {
  modelValue.value = selected.value;
});
</script>

<template>
  <Select.Root v-model="selected">
    <Select.Trigger :data-fit="fit" class="cursor-pointer w-full data-[fit=true]:w-fit!">
      <select-value as-child>
        <template #default="{ selectedLabel }">
          <ui-input :model-value="selectedLabel.join(',')" />
        </template>
      </select-value>
    </Select.Trigger>
    <Select.Portal>
      <select-list :options="props.options" />
    </Select.Portal>
  </Select.Root>
</template>

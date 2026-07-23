<script lang="ts" setup>
import { UiSelect, UiInput, UiNumeric, UiCheckbox, UiButton } from '@/components/ui';
import { ref, watch } from 'vue';
import type { ZodStandardJSONSchemaPayload } from 'zod/v4/core';

const { id, label, returnType, setData, setOperator } = defineProps<{
  id: string;
  label: string;
  returnType: ZodStandardJSONSchemaPayload<any>;
  setData: (id: string, data: any) => void;
  setOperator: (id: string, operator: string) => void;
}>();

const emits = defineEmits<{ remove: [string] }>();
const ComparableData = ['number', 'integer'];
const EqualityData = ['string', 'number', 'boolean', 'integer'];

const type = returnType.type?.toString() ?? 'string';

const operator = [
  { label: 'Equal', value: 'equal', disabled: !EqualityData.includes(type) },
  { label: 'Not Equal', value: 'notEqual', disabled: !EqualityData.includes(type) },
  { label: 'Less Than', value: 'lessThanInclusive', disabled: !ComparableData.includes(type) },
  { label: 'Less ThanInclusive', value: 'lessThanInclusive', disabled: !ComparableData.includes(type) },
  { label: 'Grater Than', value: 'graterThan', disabled: !ComparableData.includes(type) },
  { label: 'Greater Than Inclusive', value: 'greaterThanInclusive', disabled: !ComparableData.includes(type) },
  { label: 'In', value: 'in', disabled: type !== 'array' },
  { label: 'Not In', value: 'notIn', disabled: type !== 'array' },
];

const components = {
  string: UiInput,
  number: UiNumeric,
  boolean: UiCheckbox,
  object: null,
  array: UiInput,
  null: null,
  integer: UiNumeric,
};

const value = ref();
const currentOperator = ref('equal');

const onClickRemove = () => {
  emits('remove', id);
};

watch(value, () => {
  setData(id, value.value);
});
watch(currentOperator, () => {
  setOperator(id, currentOperator.value);
});
</script>

<template>
  <div class="w-full pl-2">
    <div class="w-full h-fit flex items-center gap-4 px-2 py-1 text-warm-foreground">
      <div class="w-4/5 flex items-center gap-4">
        <span>{{ label }}</span>
        <ui-select v-model="currentOperator" :options="operator" />
      </div>
      <component :is="components[returnType.type ?? 'string']" v-model="value" />
      <ui-button icon size="sm" color="danger" @click="onClickRemove">
        <div class="i-material-symbols:delete-outline size-6" />
      </ui-button>
    </div>
  </div>
</template>
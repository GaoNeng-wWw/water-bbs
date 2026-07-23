<script lang="ts" setup>
import { taskControllerGetRewards } from '@/api';
import { UiCheckbox, UiInput, UiNumeric, UiButton, UiSelect } from '@/components/ui';
import { NOT_PUBLIC_ENDPOINT } from '@/composables';
import { computed, ref, type Component, type Ref } from 'vue';
import type { JSONSchema } from 'zod/v4/core';
import { v7 } from 'uuid';

const rewards = await taskControllerGetRewards({
  client: NOT_PUBLIC_ENDPOINT,
})
  .then(resp => resp.data ?? []);
const options = computed(() => {
  return rewards.map((reward) => {
    return {
      label: reward.label,
      value: reward.code,
    };
  });
});
const getSchemaType = (code: string) => {
  if (!code) {
    return 'null';
  }
  const schema = rewards.filter(r => r.code === code)[0].schema as JSONSchema.Schema;
  return schema['type'] as string;
};
const components: Record<string, Component | null> = {
  string: UiInput,
  number: UiNumeric,
  boolean: UiCheckbox,
  object: null,
  array: UiInput,
  null: null,
  integer: UiNumeric,
};

type FormItem = {
  id: string;
  actor: string;
  value: any;
  component: Component | null;
};
const items: Ref<FormItem[]> = ref([]);
const onClickAdd = () => {
  items.value.push({
    id: v7(),
    actor: '',
    value: '',
    component: components['string'],
  });
};
const getCompnent = (code: string) => {
  const exceptType = getSchemaType(code);
  return components[exceptType] || null;
};
const remove = (targetId: string) => {
  items.value = items.value.filter(item => item.id !== targetId);
};
</script>

<template>
  <div class="w-full">
    <div class="space-y-2">
      <div v-for="item of items" :key="item.id" class="flex gap-4">
        <ui-select v-model="item.actor" :options="options" />
        <component :is="getCompnent(item.actor)" v-model="item.value" />
        <ui-button icon size="sm" color="danger" @click="remove(item.id)">
          <div class="i-material-symbols:delete-outline size-6" />
        </ui-button>
      </div>
    </div>
    <div class="mt-2">
      <ui-button full @click="onClickAdd">
        Add
      </ui-button>
    </div>
  </div>
</template>

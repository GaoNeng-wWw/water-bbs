<script lang="ts" setup>
import type { ZodObject } from 'zod';
import z from 'zod';
import type { JSONSchema } from 'zod/v4/core';
import type { UiCheckboxDto, UiDatePickerDto, UiInputDto, UiSelectDto } from '@/api';
import { computed, h, reactive, useTemplateRef, watch, type VNode } from 'vue';
import { UiCalendarSelectField, UiCheckbox, UiFormItem, UiInput, UiListbox, UiListboxItem, UiForm } from '@/components/ui';
import { useNow } from '@/composables';
import { toTypedSchema } from '@vee-validate/zod';
import { createCalendarDate, createNowCalendarDate, getUserTimezone } from '@/helper';

type UiDto = UiCheckboxDto | UiDatePickerDto | UiInputDto | UiSelectDto;

const { param, ui, disabledFields = [], defaultValues = {} } = defineProps<{
  param: z.core.ZodStandardJSONSchemaPayload<ZodObject>;
  ui: UiDto[];
  disabledFields?: string[];
  defaultValues?: Record<string, any>;
}>();

const modelValue = defineModel<Record<string, any>>({ default: () => ({}) });
const uiDef = Object.groupBy(ui, item => item.id);
const data = reactive<Record<string, any>>({ ...defaultValues, ...modelValue.value });
const rules = toTypedSchema(z.fromJSONSchema(param));
const form = useTemplateRef('form');

const onModelValueUpdate = (key: string, value: any) => {
  data[key] = value;
};

const buildUiAction = (dto: UiDto) => {
  const isDisabled = disabledFields.includes(dto.id);
  switch (dto.type) {
    case 'input':
      return h(UiInput, {
        'type': dto.textType,
        'modelValue': data[dto.id],
        'onUpdate:modelValue': value => onModelValueUpdate(dto.id, value),
        'disabled': isDisabled,
      });
    case 'select':
      const options = dto.options
        .map((item) => {
          return h(UiListboxItem, {
            id: item.value,
            value: item.value,
          }, item.label);
        });
      return h(UiListbox, {
        'modelValue': data[dto.id],
        'onUpdate:modelValue': value => onModelValueUpdate(dto.id, value),
        'disabled': isDisabled,
      }, options);
    case 'checkbox':
      return h(UiCheckbox, {
        'modelValue': data[dto.id],
        'onUpdate:modelValue': value => onModelValueUpdate(dto.id, value),
        'disabled': isDisabled,
      });
    case 'date-picker':
      if (!data[dto.id]) {
        data[dto.id] = createNowCalendarDate().toDate(getUserTimezone()).toISOString();
      }
      return h(UiCalendarSelectField, {
        'modelValue': data[dto.id],
        'onUpdate:modelValue': (value) => {
          data[dto.id] = value
        },
        'disabled': isDisabled,
      });
  }
};

const visit = (node: JSONSchema._JSONSchema, name?: string): VNode[] => {
  if (typeof node === 'boolean') {
    return [];
  }
  if (name) {
    const [ui] = uiDef[name] ?? [];
    if (!ui) {
      return [];
    }
    const uiActionComponent = buildUiAction(ui);
    return [
      h(
        UiFormItem,
        {
          prop: name,
          label: ui.label ?? ui.id,
        },
        () => uiActionComponent,
      ),
    ];
  }
  if (node.type === 'object') {
    const properties = node.properties ?? {};
    const keys = Object.keys(properties);
    return keys.flatMap(key => visit(properties[key], key));
  }
  if (node.type === 'array') {
    const items = node.items ?? [];
    if (!Array.isArray(items)) {
      return [...visit(items)];
    }
    return items.flatMap(item => visit(item, name));
  }
  return [];
};

const validate = () => {
  if (!form.value) {
    return;
  }
  return form.value.validate();
};

defineExpose({ validate });

const components = computed(() => visit(param, ''));

watch(data, () => {
  modelValue.value = data;
});
</script>

<template>
  <div>
    <ui-form ref="form" :model="data" :schema="rules">
      <component :is="component" v-for="component in components" :key="component.key" />
    </ui-form>
  </div>
</template>

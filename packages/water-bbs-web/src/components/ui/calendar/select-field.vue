<script lang="ts" setup>
import calendar from './calendar.vue';
import { DateFieldInput, DateFieldRoot } from 'reka-ui';
import { computed, ref, watch, type Ref } from 'vue';
import { UiField } from '../form';
import { CalendarDate, type DateValue } from '@internationalized/date';
import { UiPopoverContent, Popover, PopoverTrigger } from '../popover';

defineOptions({
  inheritAttrs: true,
});

const modelValue = defineModel<DateValue>({ required: true });

const date = computed(() => modelValue.value);
const currentDate = ref(date.value) as Ref<DateValue>;

watch(currentDate, () => {
  modelValue.value = currentDate.value;
  console.log(modelValue.value)
});
</script>

<template>
  <popover>
    <popover-trigger as-child>
      <ui-field v-bind="$attrs" class="w-fit!">
        <date-field-root
          v-slot="{ segments }"
          :default-value="currentDate"
          :model-value="currentDate"
          class="flex w-fit items-center justify-center gap-2"
        >
          <template
            v-for="item in segments"
            :key="item.part.toString()"
          >
            <date-field-input
              v-if="item.part === 'literal'"
              :part="item.part"
              class="text-surface-fg"
            >
              {{ item.value }}
            </date-field-input>
            <date-field-input
              v-else
              :part="item.part"
              class="rounded p-0.5 focus:outline-none data-placeholder:text-surface-fg"
            >
              {{ item.value }}
            </date-field-input>
          </template>
        </date-field-root>
      </ui-field>
    </popover-trigger>
    <ui-popover-content>
      <calendar v-model="currentDate" />
    </ui-popover-content>
  </popover>
</template>

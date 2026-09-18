<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput, UiCalendarSelectField } from '@/components/ui';
import { CalendarDate } from '@internationalized/date';
import { ref, type Ref } from 'vue';

const date = new Date();

const now = ref(
  new CalendarDate(date.getFullYear() + 1, date.getMonth(), date.getDate() + 1),
) as Ref<CalendarDate>;
</script>

<template>
  <div class="w-full">
    <ui-form>
      <ui-form-item prop="reason" label="举报原因">
        <ui-input placeholder="请输入举报原因" />
      </ui-form-item>
      <ui-form-item prop="duration" label="提案时常">
        <ui-calendar-select-field v-model="now" />
      </ui-form-item>
    </ui-form>
  </div>
</template>

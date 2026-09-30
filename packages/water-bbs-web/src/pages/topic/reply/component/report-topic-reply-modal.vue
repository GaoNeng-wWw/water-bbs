<script lang="ts" setup>
import { reportReply } from '@/api';
import { UiButton, UiForm, UiFormItem, UiInput, UiCalendarSelectField, UiCheckbox } from '@/components/ui';
import { GovernanceMemberKind } from '@/directive';
import { CalendarDate, type DateValue } from '@internationalized/date';
import { ConfigProvider } from 'reka-ui';
import { reactive } from 'vue';

const { replyId } = defineProps<{ replyId: string }>();

const now = new Date();

const model = reactive({
  title: '',
  duration: new CalendarDate(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1) as DateValue,
  reason: '',
  emergency: false,
  remove: false,
});

const submit = () => {
  reportReply({
    body: {
      emergency: model.emergency,
      proposalEndAt: model.duration.toString(),
      reason: model.reason,
      title: model.title,
      remove: model.remove,
    },
    path: { replyId },
  });
};
</script>

<template>
  <div class="w-full">
    <ui-form class="space-y-2">
      <ui-form-item prop="title" label="提案标题">
        <ui-input v-model="model.title" placeholder="15字以内阐述举报原因" />
      </ui-form-item>
      <ui-form-item prop="reason" label="举报原因">
        <ui-input v-model="model.reason" placeholder="举报详细原因" />
      </ui-form-item>
      <ui-form-item prop="duration" label="提案时长">
        <config-provider locale="zh">
          <ui-calendar-select-field v-model="model.duration as DateValue" />
        </config-provider>
      </ui-form-item>
      <ui-form-item v-governance-member="GovernanceMemberKind.Bd" prop="emergency" label="紧急提案">
        <ui-checkbox v-model="model.emergency" />
      </ui-form-item>
      <ui-form-item v-governance-member="GovernanceMemberKind.Bd" prop="remove" label="删除">
        <ui-checkbox v-model="model.remove" />
      </ui-form-item>
    </ui-form>
    <div class="mt-3">
      <ui-button color="primary" size="full" @click="submit">
        提交举报
      </ui-button>
    </div>
  </div>
</template>

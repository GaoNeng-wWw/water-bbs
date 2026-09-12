<script lang="ts" setup>
import { UiForm, UiFormItem, UiInput } from '@/components/ui';
</script>

<template>
  <div class="w-full">
    <ui-form>
      <ui-form-item prop="reason" label="举报原因">
        <ui-input placeholder="请输入举报原因" />
      </ui-form-item>
      <ui-form-item prop="duration" label="提案时常">

      </ui-form-item>
    </ui-form>
  </div>
</template>
<script lang="ts" setup>
import {
  UiAvatar,
  UiDialog, UiDialogContent, UiDialogTrigger,
} from '@/components/ui';
import AuthTab from '../auth/auth-tab.vue';
</script>

<template>
  <div class="w-fit flex shrink-0 gap-3">
    <ui-dialog>
      <ui-dialog-trigger class="shrink-0" as-child>
        <ui-avatar fallback-text="test" class="shrink-0" />
      </ui-dialog-trigger>
      <ui-dialog-content>
        <auth-tab />
      </ui-dialog-content>
    </ui-dialog>
  </div>
</template>

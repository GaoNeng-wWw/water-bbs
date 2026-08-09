<script lang="ts" setup>
import { UiDialog, UiDialogContent, UiDialogTrigger } from '@/components/ui';
import AuthTab from '../auth/auth-tab.vue';
</script>

<template>
  <div class="w-fit flex shrink-0 gap-3">
    <ui-dialog>
      <ui-dialog-trigger class="shrink-0" as-child>
        <div class="avatar-md rounded-full bg-surface-200 border border-surface-300 shrink-0 p-1 cursor-pointer">
          <div class="size-full icon-[material-symbols--person] text-surface-fg" />
        </div>
      </ui-dialog-trigger>
      <ui-dialog-content>
        <auth-tab />
      </ui-dialog-content>
    </ui-dialog>
  </div>
</template>

<script lang="ts" setup>
import { UiButton, UiDropMenu } from '@/components/ui';
import SelectList from '@/components/ui/select/select-list.vue';
import { ROOT_ID } from '@/composables';
import { SelectRoot } from 'reka-ui';
const { id } = defineProps<{ id: string }>();
</script>

<template>
  <div class="w-fit space-y-4">
    <ui-drop-menu>
      <template #trigger>
        <ui-button icon size="sm">
          <div class="i-material-symbols:add size-6" />
        </ui-button>
      </template>
      <div>
        <select-root>
          <select-list
            :options="[
              {
                label: 'condition',
                children: [
                  {
                    label: 'any',
                    value: 'any',
                  },
                ],
              },
            ]"
          />
        </select-root>
      </div>
    </ui-drop-menu>
    <ui-button v-if="id !== ROOT_ID" icon size="sm" color="danger">
      <div class="i-material-symbols:delete-outline size-6" />
    </ui-button>
  </div>
</template>

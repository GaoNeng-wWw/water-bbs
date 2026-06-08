<script lang="ts" setup>
import { UiButton, UiCheckbox } from '@/components/ui';
import type { Editor } from '@tiptap/vue-3';
import { inject, ref } from 'vue';
import { EditorContextKey } from './editor.props';

const { editor } = defineProps<{
  editor: Editor;
}>();

const ctx = inject(EditorContextKey)!;
const commands = ref(ctx.extensions);

const source = ref(false);
const onSourceChange = (val: boolean) => {
  source.value = val;
  ctx.setSource(val);
};
</script>

<template>
  <div class="w-full flex gap-2 items-center flex-wrap">
    <template v-for="cmd of commands">
      <div v-if="cmd.icon" :key="cmd.icon.name" :data-active="cmd.isActive(editor)" class="group">
        <ui-button
          v-if="cmd.onClick"
          icon
          size="sm"
          class="group-data-[active=true]:bg-warm-500/10"
          @click="() => cmd.onClick?.(editor)"
        >
          <component :is="cmd.icon" />
        </ui-button>
        <component :is="cmd.icon" v-else />
      </div>
    </template>
    <div class="size-fit ml-auto mr-0">
      <ui-checkbox :model-value="source" label="Code" size="sm" @update:model-value="onSourceChange" />
    </div>
  </div>
</template>

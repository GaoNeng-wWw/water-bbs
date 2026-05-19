<script lang="ts" setup>
import { UiButton } from '@/components/ui';
import type { Editor } from '@tiptap/vue-3';
import { ref, type Ref } from 'vue';

const { editor } = defineProps<{ editor: Editor }>();

type Command = {
  icon: string;
  isActive: () => void;
  onClick: () => void;
};
const commands: Ref<Command[]> = ref(
  [
    { icon: 'i-material-symbols:format-bold', isActive: () => editor.isActive('bold'), onClick: () => editor.commands.toggleBold() },
    { icon: 'i-material-symbols:format-italic', isActive: () => editor.isActive('italic'), onClick: () => editor.commands.toggleItalic() },
    { icon: 'i-material-symbols:format-quote', isActive: () => editor.isActive('blockquotes'), onClick: () => editor.commands.toggleItalic() },
  ],
);
</script>

<template>
  <div class="w-full flex gap-2 items-center flex-wrap">
    <div v-for="cmd of commands" :key="cmd.icon" :data-active="cmd.isActive()" class="group">
      <ui-button
        icon
        size="sm"
        class="group-data-[active=true]:bg-opacity-40!"
        @click="cmd.onClick"
      >
        <div class="size-4 bg-warm-foreground" :class="cmd.icon" />
      </ui-button>
    </div>
  </div>
</template>

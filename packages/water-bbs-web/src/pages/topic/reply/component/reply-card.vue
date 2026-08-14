<script lang="ts" setup>
import { UiAvatar, UiPopover, UiPopoverContent, UiPopoverTrigger, UiButton, UiListbox, UiListboxSection, UiListboxItem } from '@/components/ui';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { StarterKit } from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';

const props = defineProps<{
  content: string;
  authorName: string;
  authorId: string;
}>();

const editor = useEditor({
  editable: false,
  extensions: [StarterKit, Markdown.configure({
    markedOptions: {
      gfm: true,
      async: true,
      pedantic: true,
    },
    indentation: {
      style: 'space',
    },
  })],
  content: props.content,
  contentType: 'markdown',
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert',
    },
  },
});
</script>

<template>
  <div
    class="
      w-full p-4 space-y-4 border-x border-b border-surface-200
      pb-8
      first:border-t
    "
  >
    <div class="w-full flex justify-between items-center">
      <div class="w-fit flex items-center gap-2">
        <ui-avatar size="sm" url="https://placehold.co/32" fallback-text="" />
        <span class="text-md text-surface-fg">{{ props.authorId }}</span>
      </div>
      <ui-popover>
        <ui-popover-trigger>
          <ui-button icon variant="ghost">
            <div class="icon-[material-symbols--more-horiz] size-5 text-surface-fg" />
          </ui-button>
        </ui-popover-trigger>
        <ui-popover-content class="w-50!">
          <ui-listbox mode="none">
            <ui-listbox-section label="行为">
              <ui-listbox-item id="report" value="report" danger>
                举报
              </ui-listbox-item>
            </ui-listbox-section>
          </ui-listbox>
        </ui-popover-content>
      </ui-popover>
    </div>
    <div class="w-full h-fit" @click.stop.prevent>
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

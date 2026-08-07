<script setup lang="ts">
import { UiPagination, UiShadowScroll, UiButton } from '@/components/ui/index.ts';
import ReplyCard from './reply-card.vue';
import { ReplyEditor, Toolbar, type ToolbarItem } from '@/components/app';

const emits = defineEmits<{
  publishReply: [string];
}>();
const page = defineModel<number>({ required: true, default: () => 1 });
const items: ToolbarItem[] = [
  {
    type: 'dropdown',
    icon: 'icon-[material-symbols--format-h1]',
    children: [
      {
        type: 'button',
        icon: 'icon-[material-symbols--format-h1]',
        onClick(editor) {
          editor.commands.setHeading({ level: 1 });
        },
      },
    ],
  },
  {
    type: 'button',
    icon: 'icon-[material-symbols--format-bold]',
    onClick(editor) {
      return editor.commands.toggleBold();
    },
    active(editor) {
      return editor.isActive('bold');
    },
  },
  {
    type: 'button',
    icon: 'icon-[material-symbols--format-italic]',
    onClick(editor) {
      return editor.commands.toggleItalic();
    },
    active(editor) {
      return editor.isActive('italic');
    },
  },
  {
    type: 'button',
    icon: 'icon-[material-symbols--broken-image-outline]',
    onClick(_) {
      // image upload
    },
  },
  {
    type: 'dropdown',
    icon: 'icon-[material-symbols--format-list-bulleted]',
    children: [
      {
        type: 'button',
        icon: 'icon-[material-symbols--format-list-bulleted]',
        onClick(editor) {
          editor.commands.toggleBulletList();
        },
        active(editor) {
          return editor.isActive('bulletList');
        },
      },
      {
        type: 'button',
        icon: 'icon-[material-symbols--format-list-numbered-sharp]',
        onClick(editor) {
          editor.commands.toggleOrderedList();
        },
        active(editor) {
          return editor.isActive('orderedList');
        },
      },
    ],
  },
];

const onPublish = (content: string) => {
  emits('publishReply', content);
};
</script>

<template>
  <div class="w-full flex flex-col">
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <reply-card />
    <div class="my-4">
      <ui-pagination
        v-model:page="page"
        :items-per-page="10"
        :total="100"
        show-edges
      />
    </div>
    <div class="w-full h-fit rounded-md border border-surface-200 space-y-2 pr-2 py-2">
      <ui-shadow-scroll class="h-50" :style="{ '--scroll-shadow-size': '0' }">
        <reply-editor>
          <template #toolbar="{ editor }">
            <div class="w-full h-fit sticky top-0 z-10 bg-bg/20 backdrop-blur">
              <toolbar v-if="editor" :items="items" :editor="editor" />
            </div>
          </template>
        </reply-editor>
      </ui-shadow-scroll>
      <div class="w-full px-2 py-3">
        <ui-button color="primary" @click="onPublish">
          发布
        </ui-button>
      </div>
    </div>
  </div>
</template>

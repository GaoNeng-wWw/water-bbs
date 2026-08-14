<script setup lang="ts">
import { UiPagination, UiShadowScroll, UiButton } from '@/components/ui/index.ts';
import ReplyCard from './reply-card.vue';
import { ReplyEditor, Toolbar, type ToolbarItem } from '@/components/app';
import { useQuery } from '@tanstack/vue-query';
import { listReply } from '@/api/sdk.gen.ts';
import { computed, useTemplateRef } from 'vue';
import ReplyCardListSkeleton from './reply-card-list.skeleton.vue';

const props = defineProps<{
  topicId: string;
  publishLoading?: boolean;
  size: number;
}>();
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

const replyEdtior = useTemplateRef('reply-editor');

const onPublish = () => {
  if (!replyEdtior.value) {
    return;
  }
  emits('publishReply', replyEdtior.value.getContent());
};

const { data, isLoading } = useQuery({
  queryKey: ['replies', 'topic-id', props.topicId, 'page', page, 'size', props.size],
  queryFn: () => {
    return listReply({
      path: { topicId: props.topicId },
      query: {
        page: page.value,
        size: props.size,
      },
    })
      .then(resp => resp.data);
  },
  suspense: true,
});
const topicList = computed(() => data.value?.data ?? []);
const total = computed(() => data.value?.total ?? 0);
</script>

<template>
  <div class="w-full flex flex-col">
    <div v-if="!isLoading" class="w-full">
      <reply-card
        v-for="item of topicList"
        :key="item.id.toString()"
        :content="item.content"
        :author-id="item.author.id.toString()"
        :author-name="item.author.nick"
      />
    </div>
    <reply-card-list-skeleton v-else />
    <div class="my-4">
      <ui-pagination
        v-model:page="page"
        :items-per-page="props.size"
        :total="total"
        show-edges
      />
    </div>
    <div class="w-full h-fit rounded-md border border-surface-200 space-y-2 pr-2 overflow-hidden">
      <ui-shadow-scroll class="h-50" :style="{ '--scroll-shadow-size': '0' }">
        <reply-editor ref="reply-editor" placeholder="write something">
          <template #toolbar="{ editor }">
            <div class="w-[calc(100%-1rem)] h-fit sticky top-0 z-10 bg-bg/10 backdrop-blur-lg px-4 py-1">
              <toolbar v-if="editor" :items="items" :editor="editor" />
            </div>
          </template>
        </reply-editor>
      </ui-shadow-scroll>
      <div class="w-full px-2 py-3">
        <ui-button color="primary" :loading="props.publishLoading" @click="onPublish">
          发布
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  UiButton,
  UiDrawerRoot, UiDrawerContent, UiDrawerTrigger, UiInput, UiForm, UiFormItem,
  UiPopover, UiPopoverTrigger, UiPopoverContent,
} from '@/components/ui';
import { vElementVisibility } from '@vueuse/components';
import { Toolbar, TopicEditor, Category, type ToolbarItem } from '@/components/app';
import { computed, ref, useTemplateRef } from 'vue';
import { useCategoryList } from '@/composables';
import { createTopic } from '@/api';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { useFileDialog } from '@vueuse/core';

const topicEditorEl = useTemplateRef('topic-editor');
const activeCategoryId = ref<string>('');
const title = ref('');
const publishedLoading = ref(false);
const { data, loadMore, done, getCategoryById } = useCategoryList();

const { t } = useI18n({ useScope: 'local' });
const router = useRouter();

const selectedCategory = computed(() => getCategoryById(activeCategoryId.value)?.[0]?.name ?? t('category'));

const { open, onChange } = useFileDialog();

onChange((fileList) => {
  if (!fileList || !fileList.length || !topicEditorEl.value) {
    return;
  }
  const editor = topicEditorEl.value.getEditor();
  if (!editor) {
    return;
  }
  
});

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
    onClick(editor) {
      open();
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

const publishTopic = () => {
  const content = topicEditorEl.value?.getContent() ?? {};
  publishedLoading.value = true;
  createTopic({
    path: {
      categoryId: activeCategoryId.value,
    },
    body: {
      content,
      title: title.value,
      pinned: false,
    },
  })
    .then((resp) => {
      if (!resp.data) {
        return;
      }
      router.replace({ path: `/topic/${resp.data.id}` });
      toast.success(t('published'));
    })
    .finally(() => {
      publishedLoading.value = false;
    });
};
</script>

<template>
  <ui-drawer-root>
    <ui-drawer-trigger>
      <ui-button color="primary">
        {{ t('publish') }}
      </ui-button>
    </ui-drawer-trigger>
    <ui-drawer-content class="max-w-3xl w-full">
      <ui-form label-position="top" class="space-y-4">
        <ui-form-item :label="t('title')" prop="title">
          <div class="w-full flex gap-4">
            <ui-input v-model="title" />
            <ui-button color="primary" html-type="button" :loading="publishedLoading" @click="publishTopic">
              {{ t('publish') }}
              <div v-if="publishedLoading" class="icon-[mdi--loading] size-5 ml-3 animate-spin" />
            </ui-button>
          </div>
        </ui-form-item>
        <ui-form-item :label="t('category')" prop="category">
          <ui-popover>
            <ui-popover-trigger as-child>
              <ui-button html-type="button" class="inline-flex">
                {{ selectedCategory }}
              </ui-button>
            </ui-popover-trigger>
            <ui-popover-content :width-follow-trigger="false" class="w-80!" as-child>
              <div class="w-full px-2 bg-surface-50">
                <Category.List v-model="activeCategoryId" :items="data" />
                <div v-if="!done" v-element-visibility="loadMore" class="w-full h-1" />
              </div>
            </ui-popover-content>
          </ui-popover>
        </ui-form-item>
        <ui-form-item :label="t('content')" prop="content">
          <topic-editor ref="topic-editor" class="h-full overflow-auto">
            <template #toolbar="{ editor }">
              <toolbar v-if="editor" :items="items" :editor="editor" />
            </template>
          </topic-editor>
        </ui-form-item>
      </ui-form>
    </ui-drawer-content>
  </ui-drawer-root>
</template>

<i18n lang="yaml">
zh-cn:
  publish: 发布
  title: 标题
  category: 分区
  content: 正文
  published: 发布成功
en-us:
  publish: Publish
  title: Title
  category: Category
  content: Content
  published: Published
</i18n>

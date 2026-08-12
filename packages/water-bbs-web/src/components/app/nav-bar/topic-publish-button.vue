<script lang="ts" setup>
import {
  UiButton,
  UiDrawerRoot, UiDrawerContent, UiDrawerTrigger, UiShadowScroll, UiInput, UiForm, UiFormItem,
  UiPopover, UiPopoverTrigger, UiPopoverContent,
} from '@/components/ui';
import { vElementVisibility } from '@vueuse/components';
import { TopicEditor, Category } from '@/components/app';
import { computed, ref, useTemplateRef } from 'vue';
import { useCategoryList } from '@/composables';
import { createTopic } from '@/api';

const topicEditorEl = useTemplateRef('topic-editor');
const activeCategoryId = ref<string>('');
const title = ref('');
const publishedLoading = ref(false);
const { data, loading, loadMore, done, getCategoryById } = useCategoryList();

const selectedCategory = computed(() => getCategoryById(activeCategoryId.value)?.[0]?.name ?? '请选择');

const publishTopic = () => {
  const content = topicEditorEl.value?.getContent() ?? '';
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
  .finally(() => {
    publishedLoading.value = false;
  })
};
</script>

<template>
  <ui-drawer-root>
    <ui-drawer-trigger>
      <ui-button color="primary">
        发布
      </ui-button>
    </ui-drawer-trigger>
    <ui-drawer-content class="max-w-3xl w-full">
      <ui-form label-position="top" class="space-y-4">
        <ui-form-item label="标题" prop="title">
          <div class="w-full flex gap-4">
            <ui-input v-model="title" />
            <ui-button color="primary" html-type="button" :loading="publishedLoading" @click="publishTopic">
              发布
              <div v-if="publishedLoading" class="icon-[mdi--loading] size-5 ml-3 animate-spin" />
            </ui-button>
          </div>
        </ui-form-item>
        <ui-form-item label="分区" prop="category">
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
        <ui-form-item label="正文" prop="content">
          <ui-shadow-scroll class="h-[50vh]">
            <topic-editor ref="topic-editor" />
          </ui-shadow-scroll>
        </ui-form-item>
      </ui-form>
    </ui-drawer-content>
  </ui-drawer-root>
</template>

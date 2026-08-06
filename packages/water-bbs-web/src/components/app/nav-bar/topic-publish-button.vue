<script lang="ts" setup>
import {
  UiButton,

  UiDrawerRoot, UiDrawerContent, UiDrawerTrigger, UiShadowScroll, UiInput, UiForm, UiFormItem,
  UiPopover, UiPopoverTrigger, UiPopoverContent,
  UiListbox,
  UiListboxSection,
  UiListboxItem,
} from '@/components/ui';
import { TopicEditor } from '@/components/app';
import { computed, ref } from 'vue';

const category = ref<string[]>([]);
const selectedCategory = computed(() => category.value?.[0] ?? '请选择');
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
            <ui-input />
            <ui-button color="primary">
              发布
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
                <ui-listbox v-model="category">
                  <ui-listbox-section>
                    <ui-listbox-item id="test" value="test">
                      test
                    </ui-listbox-item>
                  </ui-listbox-section>
                </ui-listbox>
              </div>
            </ui-popover-content>
          </ui-popover>
        </ui-form-item>
        <ui-form-item label="正文" prop="content">
          <ui-shadow-scroll class="h-[50vh]">
            <topic-editor />
          </ui-shadow-scroll>
        </ui-form-item>
      </ui-form>
    </ui-drawer-content>
  </ui-drawer-root>
</template>

<script lang="ts" setup>
import {
  UiAvatar, UiButton,
  type ListBoxItem,
  UiDialog, UiDialogContent, UiDialogTrigger,
  UiDrawerRoot, UiDrawerContent, UiDrawerTrigger, UiShadowScroll, UiInput, UiForm, UiFormItem,
  UiPopover, UiPopoverTrigger, UiPopoverContent,
  UiListbox,
  UiListboxSection,
  UiListboxItem,
} from '@/components/ui';
import { TopicEditor } from '@/components/app';
import { useRouter } from 'vue-router';
import AuthTab from '../auth/auth-tab.vue';
import { computed, ref } from 'vue';

const router = useRouter();
const category = ref<string[]>([]);
const selectedCategory = computed(() => category.value?.[0] ?? '请选择');

const onSelect = (item: ListBoxItem) => {
  if (item.id === 'loggedout') {
    return;
  }
  router.push({ path: item.value });
};
</script>

<template>
  <div class="w-full h-fit py-2 px-6 sticky bg-background/20 backdrop-blur-md top-0 z-[calc(infinity+1)]">
    <div class="max-w-5xl mx-auto flex gap-3">
      <div class=" w-form-md h-form-md bg-danger-500 shrink-0" />
      <div class="grow shrink" />
      <div class="w-fit flex shrink-0 gap-3">
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
            <!-- <ui-shadow-scroll>
            </ui-shadow-scroll> -->
          </ui-drawer-content>
        </ui-drawer-root>
        <ui-dialog>
          <ui-dialog-trigger class="shrink-0" as-child>
            <ui-avatar fallback-text="test" class="shrink-0" />
          </ui-dialog-trigger>
          <ui-dialog-content>
            <auth-tab />
          </ui-dialog-content>
        </ui-dialog>
      </div>
      <!-- <ui-popover>
        <ui-popover-trigger class="shrink-0 size-md" as="button">
          <ui-avatar fallback-text="test" />
        </ui-popover-trigger>
        <ui-popover-content width-follow-trigger class="z-[calc(infinity+2)] bg-red-500">
          <ui-listbox mode="none" @select="onSelect">
            <ui-listbox-item id="Profile" value="/profile">
              Profile
            </ui-listbox-item>
            <ui-listbox-item id="loggedout" value="Logged Out" danger>
              Logged Out
            </ui-listbox-item>
          </ui-listbox>
        </ui-popover-content>
      </ui-popover> -->
    </div>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
:deep(div[data-reka-popper-content-wrapper]) {
  @apply max-w-50 w-full;
}
</style>

<script setup lang="ts">
import { CategoryList } from '@/components/app';
import { UiButton, UiPopover, UiPopoverContent, UiPopoverTrigger } from '@/components/ui';
import { storeToRefs } from 'pinia';
import { useAccount } from '@/store';
import { NOT_PUBLIC_ENDPOINT, useCheckedIn, useDrawer, useNestedCategoryTreeData } from '@/composables';
import CreatePostForm from '../post/create-post-form.vue';
import { CREATE_CATEGROY } from '@/utils';
import type { CreateCategoryModel } from '../category/create-category-menu.vue';
import CreateCategoryMenu from '../category/create-category-menu.vue';
import { categoryControllerCreateCategory } from '@/api/sdk.gen.ts';
import { noop } from '@vueuse/core';
import type { CreateCategoryResponse } from '@/api';
import { useSiteStore } from '@/store/site.store.ts';

const { showCategoryList = false } = defineProps<{
  showCategoryList?: boolean;
}>();
const { setActiveCategory } = useSiteStore();
const { isLogged, accountId } = storeToRefs(useAccount());
const { render } = useDrawer();
const { tree, expand, add } = useNestedCategoryTreeData();
const { checkIn, checked } = useCheckedIn();
expand();

const onClickSend = () => {
  render(CreatePostForm, { direction: 'bottom', snapPoints: [0.4, 0.5, 0.95, 1.0], class: 'max-w-800px w-full' });
};
const onClickSubmit = (model: CreateCategoryModel) => {
  categoryControllerCreateCategory({
    body: {
      name: model.name,
      parent: model.parent,
    },
    client: NOT_PUBLIC_ENDPOINT,
  })
    .then(resp => resp.data)
    .then(data => data ? add(data as unknown as CreateCategoryResponse) : noop);
};
const onClickCategory = (id: string) => {
  setActiveCategory(id);
};
</script>

<template>
  <div class="w-full h-full py-4 overflow-auto flex flex-col px-4 gap-8">
    <div class="w-full h-fit space-y-4">
      <div v-if="isLogged" class="w-full h-fit gap-2 flex">
        <ui-button full color="primary" shape="solid" rounded="lg" class="h-11" @click="onClickSend">
          <div class="w-full flex items-center gap-3">
            <div class="i-material-symbols:send-rounded size-5" />
            Publish
          </div>
        </ui-button>
        <ui-button
          color="success"
          :shape="checked ? 'solid' : 'ghost'"
          rounded="lg"
          :data-checked="checked"
          class="h-11 data-[checked='true']:pointer-events-none"
          @click="checkIn"
        >
          <div v-if="!checked" class="i-material-symbols:calendar-month size-6" />
          <div v-else class="i-material-symbols:event-available-outline size-6" />
        </ui-button>
      </div>
      <div class="w-full h-fit flex flex-col gap-2 text-warm-foreground">
        <router-link exact-active-class="text-primary-500 font-bold" to="/">
          Home
        </router-link>
        <router-link v-if="isLogged" exact-active-class="text-primary-500 font-bold" :to="`/profile/${accountId}`">
          Profile
        </router-link>
      </div>
    </div>
    <div v-if="showCategoryList" class="w-full h-auto flex-auto overflow-auto">
      <div class="w-full flex items-center justify-between">
        <p class="text-lg text-warm-foreground">
          Category
        </p>
        <ui-popover>
          <ui-popover-trigger>
            <ui-button v-permission="CREATE_CATEGROY" icon size="sm">
              <div class="size-6 i-material-symbols:add text-warm-foreground" />
            </ui-button>
          </ui-popover-trigger>
          <ui-popover-content>
            <create-category-menu :categories="tree" @submit="onClickSubmit" @category-expand="(node) => expand(node)" />
          </ui-popover-content>
        </ui-popover>
      </div>
      <category-list :tree="tree" class="px-2" @expand="expand" @click-category="onClickCategory" />
    </div>
  </div>
</template>

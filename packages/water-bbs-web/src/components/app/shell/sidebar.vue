<script setup lang="ts">
import { CategoryList } from '@/components/app';
import { UiButton } from '@/components/ui';
import { storeToRefs } from 'pinia';
import { useAccount } from '@/store';
import { useDrawer } from '@/composables';
import CreatePostForm from '../post/create-post-form.vue';

const { isLogged, accountId } = storeToRefs(useAccount());
const { render } = useDrawer();

const onClickSend = () => {
  render(CreatePostForm, { direction: 'bottom', snapPoints: [0.3, 0.5, 0.95] });
};
</script>

<template>
  <div class="w-full h-full py-4 overflow-auto flex flex-col px-4 gap-8">
    <div class="w-full h-fit space-y-4">
      <div v-if="isLogged" class="w-full h-fit">
        <ui-button full color="primary" shape="solid" rounded="lg" @click="onClickSend">
          Publish
        </ui-button>
      </div>
      <div class="w-full h-fit flex flex-col gap-2 text-warm-foreground">
        <router-link exact-active-class="text-primary-500 font-bold" to="/">
          Home
        </router-link>
        <router-link exact-active-class="text-primary-500 font-bold" :to="`/profile/${accountId}`">
          Profile
        </router-link>
      </div>
    </div>
    <div class="w-full h-auto flex-auto overflow-auto">
      <category-list />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppNavBar } from '@/components/app';
import { UiTabs, UiTabItem, UiButton } from '@/components/ui';
import ProfilePublishedTopicList from './components/profile-published-topic-list.vue';
import ProfileCard from './components/profile-card.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const onClickBack = () => {
  router.back();
}
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="max-w-3xl w-full mx-auto py-8 space-y-8">
      <ui-button icon variant="ghost" @click="onClickBack">
        <div class="icon-[material-symbols--keyboard-arrow-left-rounded] size-5 text-surface-fg cursor-pointer" />
      </ui-button>
      <profile-card bio="" nick-name="..." id="..." />
      <ui-tabs lazy>
        <ui-tab-item id="Topics" label="Topic">
          <div class="py-4">
            <profile-published-topic-list />
          </div>
        </ui-tab-item>
      </ui-tabs>
    </div>
  </div>
</template>

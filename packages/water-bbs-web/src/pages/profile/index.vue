<script setup lang="ts">
import { AppNavBar } from '@/components/app';
import { UiTabs, UiTabItem, UiButton } from '@/components/ui';
import ProfilePublishedTopicList from './components/profile-published-topic-list.vue';
import ProfileCard from './components/profile-card.vue';
import { useRouter } from 'vue-router';
import { getProfile } from '@/api/sdk.gen.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

const router = useRouter();
const onClickBack = () => {
  router.back();
};

const { t } = useI18n({ useScope: 'local' });

const curRoute = computed(() => router.currentRoute.value);
const params = computed(() => curRoute.value.params);
const id = computed(() => params.value.id ? params.value.id.toString() : '');
const profile = await getProfile({ path: { id: id.value } })
  .then((resp) => {
    if (resp.status === 404) {
      toast.error(t('not-found'));
      return router.replace({ path: '/' })
        .then(() => resp);
    }
    return resp;
  })
  .then(resp => resp.data).then(data => data!);
</script>

<template>
  <div class="w-full">
    <app-nav-bar />
    <div class="max-w-3xl w-full mx-auto py-8 space-y-8">
      <ui-button icon variant="ghost" @click="onClickBack">
        <div class="icon-[material-symbols--keyboard-arrow-left-rounded] size-5 text-surface-fg cursor-pointer" />
      </ui-button>
      <profile-card v-if="profile" :id="profile.id.toString()" :bio="profile.bio" :nick-name="profile.nick" :create-time="profile.createdAt" />
      <ui-tabs v-if="profile" lazy>
        <ui-tab-item id="Topics" :label="t('topics')">
          <div class="py-4">
            <profile-published-topic-list :id="profile.id.toString()" />
          </div>
        </ui-tab-item>
      </ui-tabs>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en:
    topics: Topics
    not-found: 'Profile not found'
  zh:
    topics: '主题'
    not-found: '用户不存在'
 </i18n>

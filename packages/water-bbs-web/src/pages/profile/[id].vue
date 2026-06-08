<script lang="ts" setup>
import { useAccount } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ProfileContext, ProfileNavBar } from '@/components/app';
import { useAccountProfile } from '@/composables';
import type { GetProfileResponse } from '@/api';
import { ProfileHeader } from '@/components/app/shell';
import { Layout } from '@/components/ui';
const emits = defineEmits<{
  update: [GetProfileResponse];
}>();
const route = useRoute();
const id = computed(() => route.params.id.toString());
const account = useAccount();
const { accountId } = storeToRefs(account);
const editable = computed(() => accountId.value === id.value);

const { profile, patchProfile } = useAccountProfile({
  editable,
  id: computed(() => accountId.value ?? ''),
});
</script>

<template>
  <layout>
    <template #header>
      <profile-header />
    </template>
    <profile-context v-model="profile" class="px-8" :editable="editable" @field-update="patchProfile(profile)">
      <profile-nav-bar />
    </profile-context>
  </layout>
</template>

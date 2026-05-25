<script lang="ts" setup>
import { useAccount } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ProfileContext, ProfileNavBar } from '@/components/app';
import { useAccountProfile } from '@/composables';
import type { GetProfileResponse } from '@/api';
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
  <div class="w-full">
    <profile-context v-model="profile" :editable="editable" @field-update="patchProfile(profile)">
      <profile-nav-bar />
    </profile-context>
  </div>
</template>

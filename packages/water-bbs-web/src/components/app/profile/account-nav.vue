<script lang="ts" setup>
import { inject, ref, watch } from 'vue';
import { ProfileContextKey } from './profile-context.props';
import { UiInput, UiAvatar } from '@/components/ui';

const { editable, setField, data } = inject(ProfileContextKey)!;

const bio = ref(data.value.bio);
const nick = ref(data.value.username);
const avatar = ref(data.value.avatar);

watch(data, () => {
  bio.value = data.value.bio;
  nick.value = data.value.username;
  avatar.value = data.value.avatar;
}, { immediate: true, deep: true });
</script>

<template>
  <div class="max-w-3xl mx-auto w-full flex gap-4 pt-8">
    <ui-avatar :src="avatar" :username="nick" :editable="editable" />
    <div class="grow w-fit flex flex-col h-full overflow-clip text-warm-foreground gap-2">
      <ui-input v-if="editable" v-model="nick" variant="ghost" @blur="() => setField('username', nick)" />
      <h1 v-else class="text-lg">
        {{ nick }}
      </h1>
      <ui-input v-if="editable" v-model="bio" variant="ghost" @blur="() => setField('bio', bio)" />
      <p v-else>
        {{ bio }}
      </p>
    </div>
  </div>
</template>

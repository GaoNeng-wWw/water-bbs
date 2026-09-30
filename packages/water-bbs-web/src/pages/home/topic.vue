<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { findCategory } from '@/api';
import { useQuery } from '@tanstack/vue-query';
import { TopicList } from '@/components/app';

const route = useRoute();

const activeId = ref(route.params.id?.toString() ?? '');
const { data: category } = useQuery({
  queryKey: ['categoryId', activeId],
  queryFn: () => {
    return findCategory({
      path: { id: activeId.value },
    }).then(resp => resp.data);
  },
});
</script>

<template>
  <div>
    <topic-list v-if="category" :category="{ ...category }" />
  </div>
</template>

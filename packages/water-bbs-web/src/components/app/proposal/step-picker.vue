<script lang="ts" setup>
import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import {
  UiButton,
  UiPopover, UiPopoverContent, UiPopoverTrigger,
  UiListbox, UiListboxItem, type ListBoxItem,
} from '@/components/ui';
import { getStepDef, listSteps, type StepInfo } from '@/api';

const { disabled = [] } = defineProps<{
  disabled?: string[];
}>();

const emit = defineEmits<{
  select: [info: StepInfo];
}>();

const PAGE_SIZE = 20;

const open = ref(false);

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey: ['proposal.steps'],
  initialPageParam: 1,
  queryFn: async ({ pageParam }) => {
    const resp = await listSteps({
      query: { page: pageParam, size: PAGE_SIZE },
    });
    return resp.data?.data ?? [];
  },
  getNextPageParam: (lastPage, allPages) => {
    if (!lastPage?.length || lastPage.length < PAGE_SIZE) {
      return undefined;
    };
    return allPages.length + 1;
  },
  staleTime: 5 * 60 * 1000,
});

const keys = computed(() => data.value?.pages.flatMap(p => p as string[] ?? []) ?? []);

const onSelect = async ({ value }: ListBoxItem) => {
  open.value = false;
  const resp = await getStepDef({ path: { id: value } });
  const { data } = resp;
  if (!data) {
    return;
  }
  emit('select', data);
};
</script>

<template>
  <ui-popover v-model:open="open">
    <ui-popover-trigger>
      <ui-button color="primary" size="full" html-type="button" variant="ghost">
        添加行为
      </ui-button>
    </ui-popover-trigger>
    <ui-popover-content width-follow-trigger class="mt-2">
      <ui-listbox mode="none" :disabled-key="disabled" @select="onSelect">
        <ui-listbox-item v-if="isLoading" id="__shadow__loading" value="__shadow__loading" disabled>
          加载中…
        </ui-listbox-item>
        <ui-listbox-item v-for="k in keys" :id="k" :key="k" :value="k">
          {{ k }}
        </ui-listbox-item>
        <ui-listbox-item v-if="hasNextPage" id="__shadow__loading__tips" value="__shadow__loading__tips" :disabled="isFetchingNextPage" @click="fetchNextPage">
          {{ isFetchingNextPage ? '加载中…' : '加载更多' }}
        </ui-listbox-item>
      </ui-listbox>
    </ui-popover-content>
  </ui-popover>
</template>
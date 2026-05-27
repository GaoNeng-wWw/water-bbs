import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSiteStore = defineStore('site', () => {
  const postTitle = ref('');
  const headerTitleVisble = ref(false);
  const activeCategory = ref<string>();
  const sidebarVisbility = ref(true);
  const breakponits = useBreakpoints(breakpointsTailwind);
  const isMobile = computed(()=> breakponits.isSmallerOrEqual('lg'));
  const setPostTitle = (title: string) => {
    postTitle.value = title;
  };
  const setActiveCategory = (id: string) => {
    activeCategory.value = id;
  };
  const setHeaderTitleVisbility = (val: boolean) => {
    headerTitleVisble.value = val;
  };
  const onClickMenuIcon = () => {
    if (!isMobile.value) {
      sidebarVisbility.value = !sidebarVisbility.value;
    }
  }
  return {
    postTitle,
    headerTitleVisble,
    activeCategory,
    isMobile,
    sidebarVisbility,
    setPostTitle,
    setHeaderTitleVisbility,
    setActiveCategory,
    onClickMenuIcon
  };
});

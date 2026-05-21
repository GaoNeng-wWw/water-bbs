import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSiteStore = defineStore('site', () => {
  const postTitle = ref('');
  const headerTitleVisble = ref(false);
  const activeCategory = ref<string>();
  const setPostTitle = (title: string) => {
    postTitle.value = title;
  };
  const setActiveCategory = (id: string) => {
    activeCategory.value = id;
  };
  const setHeaderTitleVisbility = (val: boolean) => {
    headerTitleVisble.value = val;
  };
  return {
    postTitle,
    headerTitleVisble,
    activeCategory,
    setPostTitle,
    setHeaderTitleVisbility,
    setActiveCategory,
  };
});

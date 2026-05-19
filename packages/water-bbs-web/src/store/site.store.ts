import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSiteStore = defineStore('site', () => {
  const postTitle = ref('');
  const headerTitleVisble = ref(false);
  const setPostTitle = (title: string) => {
    postTitle.value = title;
  };
  const setHeaderTitleVisbility = (val: boolean) => {
    headerTitleVisble.value = val;
  };
  return {
    postTitle,
    headerTitleVisble,
    setPostTitle,
    setHeaderTitleVisbility,
  };
});

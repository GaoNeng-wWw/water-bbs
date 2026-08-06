import type { Directive } from 'vue';

/**
 * @description 确保该元素只能被登陆的用户加载
 */
export const vAuthed: Directive<HTMLElement> = {
  beforeMount(el) {
    el.style.display = 'none';
  },
  mounted(el) {
    // TODO: 等接入api后，如果accessToken存在就不删除，否则就删除.
    el.remove();
  },
};

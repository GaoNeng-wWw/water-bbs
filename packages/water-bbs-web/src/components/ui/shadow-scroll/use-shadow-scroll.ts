import { onUnmounted, ref, watchEffect, type ComputedRef, type Ref } from 'vue';

export type Props = {
  mode: ComputedRef<'vertical' | 'horizontal'>;
  el: ComputedRef<HTMLElement | undefined>;
};

export type State = 'start' | 'mid' | 'end' | 'none';

export const useShadowScroll = (props: Props) => {
  const state: Ref<State> = ref('none');

  const setState = (el: HTMLElement) => {
    if (props.mode.value === 'vertical') {
      if (el.scrollHeight <= el.clientHeight) {
        state.value = 'none';
        return;
      }
      if (!el.scrollTop) {
        state.value = 'start';
        return;
      }
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        state.value = 'end';
        return;
      }
      state.value = 'mid';
      return;
    }
    if (el.scrollLeft <= el.clientWidth) {
      state.value = 'none';
      return;
    }
    if (!el.scrollLeft) {
      state.value = 'start';
      return;
    }
    if (el.scrollLeft + el.clientLeft >= el.scrollWidth) {
      state.value = 'end';
      return;
    }
    state.value = 'mid';
  };

  const onScroll = (ev: Event) => {
    const target = ev.target! as unknown as HTMLElement;
    setState(target);
  };
  let dirty = false;
  const stop = watchEffect((onCleanup) => {
    if (!props.el.value) {
      return;
    }

    const el = props.el.value;
    setState(el);
    if (!dirty) {
      el.addEventListener('scroll', onScroll);
      dirty = true;
    }
    onCleanup(() => {
      el.removeEventListener('scroll', onScroll);
    });
  });
  onUnmounted(() => {
    stop();
  });
  return { state };
};

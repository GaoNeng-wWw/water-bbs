import { computed, reactive, ref, type Ref } from 'vue';

export type FetcherResponse<Item, Param> = {
  items: Item[];
  done: boolean;
  nextParam?: Param;
};

export type Fetcher<Item, Param> = (
  param: Param,
) => Promise<FetcherResponse<Item, Param>>;

export interface UseInfiniteListOptions<Item, Param> {
  fetcher: Fetcher<Item, Param>;
  initParam: Param;
}

export function useInfiniteList<Item, Param>(
  opts: UseInfiniteListOptions<Item, Param>,
) {
  const data: Ref<Item[]> = ref([]);

  const param = ref<Param>(opts.initParam);

  const state = reactive<{
    loading: boolean;
    done: boolean;
    error: Error | null;
  }>({
    loading: false,
    done: false,
    error: null,
  });

  async function loadMore() {
    if (state.loading || state.done) {
      return;
    }

    state.loading = true;

    opts.fetcher(param.value)
      .then((resp) => {
        data.value.push(...resp.items);
        state.done = resp.done;
        if (resp.nextParam !== undefined) {
          param.value = resp.nextParam;
        }
      })
      .catch((err) => {
        state.error = err;
      })
      .finally(() => {
        state.loading = false;
      });
  }

  if (!state.loading && !state.done) {
    loadMore();
  }

  return {
    data,
    loading: computed(() => state.loading),
    done: computed(() => state.done),
    error: computed(() => state.error),
    loadMore,
  };
}

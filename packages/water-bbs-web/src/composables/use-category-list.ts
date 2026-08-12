import { listCategory } from '@/api';
import { useInfiniteList } from './use-infinite-list';

export const useCategoryList = () => {
  const resp = useInfiniteList({
    fetcher: (param: { page: number; size: number }) => {
      return listCategory({
        query: param,
      })
        .then(resp => resp.data)
        .then((data) => {
          if (!data) {
            return Promise.resolve({ done: true, items: [] });
          }
          const list = data.data;
          return {
            done: !!list.length,
            items: list,
          };
        });
    },
    initParam: { page: 1, size: 20 },
  });
  const getCategoryById = (id: string) => {
    return resp.data.value.filter(category => category.id === id);
  }
  return {
    ...resp,
    getCategoryById
  }
};

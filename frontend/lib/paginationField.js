import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // First thing it does is ask the read function for those items
      // Here, we can either do two things:
      // 1. return the items if they're already in the cache
      // 2. return false (which will trigger a network request)

      const { skip, first } = args;

      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items
      // AND there aren't enough to satisfy how many were requested
      // AND we are on the last page
      // THEN JUST SEND IT
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        //   We don't have any items, we must go to the network to fetch them
        return false;
      }

      //   if there are items, just return them from the cache
      if (items.length) {
        return items;
      }

      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when the apollo client comes back from the network with our products
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}

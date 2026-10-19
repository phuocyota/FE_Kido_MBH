// Each stock document screen owns its cache; requests in flight are shared by all rows.
export function createStockProductCache(fetchProducts, filters = {}) {
  const requests = new Map();
  const scope = { ...filters };

  return (search = "") => {
    const keyword = search.trim();
    if (!requests.has(keyword)) {
      const request = Promise.resolve()
        .then(() => fetchProducts({ ...scope, search: keyword, page: 1, size: 50 }))
        .catch((error) => {
          requests.delete(keyword);
          throw error;
        });
      requests.set(keyword, request);
    }
    return requests.get(keyword);
  };
}

export function filterOrdersAction(router, path, searchParams) {
  return async function filterOrders(prevState, formData) {
    const filterName = formData.get("filter");
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (filterName === "all") {
      params.delete("searchFilter");
      params.delete("filter");
    } else {
      params.delete("searchFilter");
      params.set("filter", filterName);
    }

    const newUrl = `${path}?${params.toString()}`;
    router.replace(newUrl);

    return {};
  };
}

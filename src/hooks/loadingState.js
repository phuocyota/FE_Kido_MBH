export function getLoadingState(pending, hasData) {
  return {
    initialLoading: pending && !hasData,
    refreshing: pending && !!hasData,
  };
}

import { useQuery } from "@tanstack/react-query";

const useFetch = ({ key, url, enabled = true, placeholderData }) => {
  const { data, error, isLoading, isFetching, status, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => await (await fetch(url)).json(),
    enabled,
    placeholderData,
  });

  return { data, error, isLoading, isFetching, status, refetch }
};

export default useFetch;

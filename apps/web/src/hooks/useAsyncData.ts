import { useEffect, useState, type DependencyList } from "react";

export function useAsyncData<T>(loader: () => Promise<T>, dependencies: DependencyList = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loader();
      setData(result);
    } catch (loaderError) {
      setError(loaderError instanceof Error ? loaderError.message : "Falha ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    reload,
  };
}

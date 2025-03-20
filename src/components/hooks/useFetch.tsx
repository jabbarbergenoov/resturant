import { useState, useCallback, useEffect } from "react";
import api from "../../axios"; // Используем api.ts вместо axios

export const useFetch = <T,>(
  url: string,
  params?: object,
  headers?: object,
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!url) return; // Не выполняем запрос, если URL равен null
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params || {}).filter(([_, value]) => value !== ""),
      );

      const response = await api.get(url, {
        params: filteredParams,
        headers, // ✅ Теперь заголовки передаются правильно
      });

      setData(response.data);
    } catch (err) {
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params), JSON.stringify(headers)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData }; // Добавил refetch
};

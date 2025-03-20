import { useState, useCallback } from "react";

type UsePostRequest<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  postRequest: (body: unknown, headers?: HeadersInit) => Promise<T | null>;
};

export function usePostRequest<T = any>(
  url: string,
  shouldRedirect = true,
): UsePostRequest<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для обработки ошибок
  const handleError = (error: any) => {
    if (error.message.includes("401") && shouldRedirect) {
      console.log("Unauthorized, redirecting to login...");
      window.location.href = "/"; // Перенаправляем на страницу входа
    }
    setError(error.message);
  };

  // Функция для добавления заголовков
  const addHeaders = (customHeaders: HeadersInit = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...customHeaders,
    };
  };

  const postRequest = useCallback(
    async (body: unknown, customHeaders: HeadersInit = {}) => {
      setLoading(true);
      setError(null);

      try {
        // Добавляем заголовки (включая токен, если он есть)
        const headers = addHeaders(customHeaders);

        // Выполняем запрос
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        // Обрабатываем ошибки HTTP (например, 401, 404)
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status}`);
        }

        // Парсим ответ
        const result: T = await response.json();
        setData(result);
        return result;
      } catch (err: any) {
        handleError(err); // Обрабатываем ошибку
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url],
  );

  return { data, loading, error, postRequest };
}

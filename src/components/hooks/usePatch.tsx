import { useState } from "react";

export const usePatchRequest = (url: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const patchRequest = async (body: any) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken"); // Получаем токен

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Добавляем токен, если он есть
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { patchRequest, loading, error };
};

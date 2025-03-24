import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface ApiResponse<T = any> {
  data: T;
}

// Создаем инстанс Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Используем переменную окружения
  headers: {
    "Content-Type": "application/json",
  },
});

// **Интерцептор для запросов**
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Добавляем токен в заголовки
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Обрабатываем ошибку запроса
    return Promise.reject(error);
  },
);

// **Интерцептор для ответов**
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Возвращаем успешный ответ
    return response;
  },
  (error: AxiosError) => {
    // Обрабатываем ошибку ответа
    if (error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      // Перенаправляем на страницу входа
      window.location.href = "/Login";
    }
    return Promise.reject(error);
  },
);

export default api;
export type { ApiResponse };

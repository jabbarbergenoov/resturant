// import Logo from "../../assets/logo.png";
import { useState } from "react";
import { usePostRequest } from "../hooks/usePostRequest";
import { useNavigate } from "react-router-dom";
import eye from "/eye.svg";
import EyeClosed from "/eye-slash.svg";
import { Link } from "react-router-dom";

type LoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  role: string;
};

export function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, postRequest } = usePostRequest<LoginResponse>(
    "http://192.168.1.48:8000/auth/login",
    false,
  );

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await postRequest({ login, password });

      if (response?.accessToken && response?.refreshToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        navigate("/navBottom");
      } else {
        console.error("Ошибка: сервер не вернул токены");
      }
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);
    }
  };

  return (
    <div className="flex justify-center w-screen items-center h-[100vh] bg-[url('/path-to-aesthetic-image.jpg')] bg-cover bg-center px-4">
      <div
        className="flex shadow-lg p-6 sm:p-8 w-full max-w-[400px] mx-auto justify-center rounded-2xl flex-col items-center 
                 bg-white/90 dark:bg-gray-800 backdrop-blur-md text-gray-900 dark:text-gray-100"
        style={{
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 className="text-2xl max-[400px]:text-3xl sm:text-4xl text-blue-700 dark:text-blue-400 font-extrabold mb-4 sm:mb-5">
          Brand
        </h1>
        <h1 className="text-base max-[400px]:text-lg sm:text-xl text-center font-bold text-gray-800 dark:text-gray-300">
          Welcome Back
        </h1>
        <p className="text-sm max-[400px]:text-lg text-gray-600 dark:text-gray-400 text-center mb-4 sm:mb-5">
          Enter your details below
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full gap-4 sm:gap-5"
        >
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            type="text"
            className="border-b border-gray-400 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 
                     focus:border-blue-500 dark:focus:border-blue-400 outline-none py-2 transition-all max-[460px]:text-sm bg-transparent"
            placeholder="Enter your login"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-b border-gray-400 dark:border-gray-600 placeholder-gray-600 dark:placeholder-gray-400 
                       focus:border-blue-500 dark:focus:border-blue-400 outline-none py-2 transition-all w-full max-[460px]:text-sm bg-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 max-[460px]:text-xs"
            >
              <img
                src={showPassword ? EyeClosed : eye}
                alt="Toggle Password Visibility"
                className="w-5 h-5 dark:invert"
              />
            </button>
          </div>
          <Link className="text-end underline" to={{ pathname: "/sign" }}>
            Нет акаунта
          </Link>
          <button
            type="submit"
            className="bg-blue-600 dark:bg-blue-500 text-white rounded-lg px-4 sm:px-5 py-2 font-semibold 
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 max-[460px]:text-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          {error && (
            <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-lg p-3 mt-3 max-[460px]:text-sm">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

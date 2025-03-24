import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-2">{t("page_not_found")}</p>
      <Link
        to="/menu"
        className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white rounded-lg transition-all"
      >
        {t("go_home")}
      </Link>
    </div>
  );
}

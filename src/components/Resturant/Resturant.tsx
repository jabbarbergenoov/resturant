import { useState, useEffect } from "react";
import { Card } from "../Card/Card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropDown";
import { Button } from "@/components/ui/button";
import { useFetch } from "../hooks/useFetch";

type Category = {
  id: number;
  name: string;
};

type Food = {
  id: number;
  name: string;
  description: string;
  price: string;
  img?: string;
};

export function Resturant() {
  const { t, i18n } = useTranslation();
  const lang = localStorage.getItem("i18nextLng") || "en";

  const {
    data: menu,
    loading: menuLoading,
    error: menuError,
  } = useFetch<Category[]>("https://techflow.duckdns.org/categorie", {
    lang_code: lang,
  });

  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<Food[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [_, setIsThemeSelectionOpen] = useState(false);

  const visibleMenu = menu ? menu.slice(0, visibleCategories) : [];

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setIsThemeSelectionOpen(false);
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const {
    data: categoryItems,
    loading: categoryLoading,
    error: categoryError,
  } = useFetch<Food[]>(
    //@ts-ignore

    selectedCategoryId
      ? `https://techflow.duckdns.org/food?categorie_id=${selectedCategoryId}&lang_code=${lang}`
      : null,
  );

  useEffect(() => {
    if (menu && menu.length > 0 && selectedCategoryId === null) {
      setSelectedCategoryId(menu[0].id);
    }
  }, [menu]);

  useEffect(() => {
    if (categoryItems) {
      setSelectedCategory(categoryItems);
    }
  }, [categoryItems]);

  if (menuLoading) {
    return <Loader className="animate-spin w-10 h-10 text-gray-500" />;
  }

  if (menuError) {
    return <div>Ошибка: {menuError}</div>;
  }

  return (
    <div className="min-h-[0vh] bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl min-h-screen mx-auto bg-white dark:bg-gray-900 shadow-lg p-3 transition-all">
        <nav className="flex items-center p-4 rounded-lg"></nav>

        <div className="flex flex-wrap gap-4 mt-5 justify-start mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:bg-gray-900">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 dark:bg-gray-900">
              <DropdownMenuItem>
                <Link to="/login">Для Вход</Link>
              </DropdownMenuItem>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Тема</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="dark:bg-gray-900">
                      <DropdownMenuItem onClick={() => changeTheme("dark")}>
                        Темная
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeTheme("light")}>
                        Светлая
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    {t("select_language")}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="dark:bg-gray-900">
                    <DropdownMenuItem onClick={() => changeLanguage("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage("ru")}>
                      Русский
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage("uz")}>
                      Uzbek
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage("kr")}>
                      Karakalpak
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {visibleMenu?.length > 0 ? (
            visibleMenu.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition-all ${
                  selectedCategoryId === category.id
                    ? "bg-yellow-700 dark:bg-yellow-500"
                    : "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-400"
                }`}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Нет категорий</p>
          )}
        </div>

        <div className="mb-6">
          {menu && menu.length > 3 && visibleCategories < menu.length ? (
            <button
              onClick={() =>
                setVisibleCategories((prev) => Math.min(prev + 3, menu.length))
              }
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg font-semibold transition-all"
            >
              Показать еще
            </button>
          ) : (
            menu &&
            menu.length > 3 && (
              <button
                onClick={() => setVisibleCategories(3)}
                className="px-4 py-2 bg-red-300 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-black dark:text-white rounded-lg font-semibold transition-all"
              >
                Скрыть категории
              </button>
            )
          )}
        </div>

        {categoryLoading ? (
          <Loader className="animate-spin w-10 h-10 text-gray-500" />
        ) : categoryError ? (
          <div>Ошибка: {categoryError}</div>
        ) : selectedCategory.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {selectedCategory.map((item) => (
              //@ts-ignore
              <Card key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            В этой категории пока нет блюд
          </p>
        )}
      </div>
    </div>
  );
}

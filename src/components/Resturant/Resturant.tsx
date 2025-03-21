import { useState, useEffect } from "react";
import { Card } from "../Card/Card";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useFetch } from '../hooks/useFetch';
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

type Category = {
  category: string;
  items: {
    name: string;
    description: string;
    price: string;
  }[];
};

export function Resturant() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light",
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [_, setIsThemeSelectionOpen] = useState(false);

  const {
    data: menu,
    loading,
    error,
    refetch,
  } = useFetch<Category[]>("http://192.168.202.153:8000/categorie", {
    lang_code: 'en',
  });

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

  return (
    <div className="min-h-[0vh] bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl min-h-screen mx-auto bg-white dark:bg-gray-900 shadow-lg p-3 transition-all">
        <nav className="flex items-center p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:bg-gray-900">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <Link to="/login">Для Вход</Link>
              </DropdownMenuItem>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Тема</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex flex-wrap gap-4 mt-5 justify-start mb-4">
          {loading ? (
            <div>Загрузка...</div>
          ) : error ? (
            <div>Ошибка: {error}</div>
          ) : (
            menu.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-white font-semibold transition-all ${
                  selectedCategory?.category === category.category
                    ? "bg-blue-700 dark:bg-blue-500"
                    : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-400"
                }`}
              >
                {category.category}
              </button>
            ))
          )}
        </div>

        <div className="mb-6">
          {visibleCategories < menu.length ? (
            <button
              onClick={() =>
                setVisibleCategories((prev) => Math.min(prev + 3, menu.length))
              }
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg font-semibold transition-all"
            >
              Показать еще
            </button>
          ) : (
            <button
              onClick={() => setVisibleCategories(3)}
              className="px-4 py-2 bg-red-300 dark:bg-red-600 hover:bg-red-400 dark:hover:bg-red-500 text-black dark:text-white rounded-lg font-semibold transition-all"
            >
              Скрыть категории
            </button>
          )}
        </div>

        {selectedCategory && selectedCategory.items && (
          <div className="grid gap-4 sm:grid-cols-2">
            {selectedCategory.items.map((item, idx) => (
              <Card key={idx} {...item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
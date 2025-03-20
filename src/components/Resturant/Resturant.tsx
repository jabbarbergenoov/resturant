import { useState, useEffect } from "react";
import { Card } from "../Card/Card";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import vertical from "/vertical.svg";

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
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [visibleCategories, setVisibleCategories] = useState<number>(3);
  const [isThemeSelectionOpen, setIsThemeSelectionOpen] = useState(false);

  const menu = [
    {
      category: "Pizzas",
      items: [
        {
          name: "Margherita",
          description: "Classic tomato and cheese",
          price: "$12.99",
        },
        {
          name: "Pepperoni",
          description: "Pepperoni and mozzarella",
          price: "$14.99",
        },
      ],
    },
    {
      category: "Pasta",
      items: [
        {
          name: "Carbonara",
          description: "Creamy sauce with bacon",
          price: "$11.99",
        },
        {
          name: "Pesto",
          description: "Basil and parmesan sauce",
          price: "$10.99",
        },
      ],
    },
    {
      category: "Burgers",
      items: [
        {
          name: "Cheeseburger",
          description: "Beef patty with cheese",
          price: "$9.99",
        },
        {
          name: "Veggie Burger",
          description: "Grilled vegetables and hummus",
          price: "$8.99",
        },
      ],
    },
    {
      category: "Каляны",
      items: [
        {
          name: "Kalian",
          description: "Beef patty with cheese",
          price: "$9.99",
        },
        {
          name: "Vegfdgfdgfdg",
          description: "Grilled vegetables and hummus",
          price: "$8.99",
        },
      ],
    },
    {
      category: "Siger",
      items: [
        {
          name: "Siger",
          description: "Beef patty with cheese",
          price: "$9.99",
        },
        {
          name: "fdgfdg",
          description: "Grilled vegetables and hummus",
          price: "$8.99",
        },
      ],
    },
    {
      category: "Drinks",
      items: [
        {
          name: "Coca Cola",
          description: "Cold refreshing drink",
          price: "$3.99",
        },
        {
          name: "Orange Juice",
          description: "Fresh orange juice",
          price: "$4.99",
        },
      ],
    },
    {
      category: "Desserts",
      items: [
        {
          name: "Chocolate Cake",
          description: "Rich chocolate cake",
          price: "$6.99",
        },
        { name: "Ice Cream", description: "Vanilla ice cream", price: "$5.99" },
      ],
    },
  ];

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setIsThemeSelectionOpen(false); // Закрываем выбор темы после выбора
  };

  return (
    <div className="min-h-[0vh] bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl min-h-screen mx-auto bg-white dark:bg-gray-900 shadow-lg p-3 transition-all">
        <nav className="flex items-center p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Меню
          </h1>

          {/* Гамбургер-меню */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="dark:bg-gray-900">
                <img src={vertical} alt="" />
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
        {/* <h1 className="text-3xl mb-5 font-bold text-center text-blue-700 dark:text-blue-300 p-2 rounded-lg">
          Restaurant Menu
        </h1> */}

        <div className="flex flex-wrap gap-4 mt-5 justify-start mb-4">
          {menu
            .slice(Number(visibleCategories), visibleCategories)
            .map((category, index) => (
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
            ))}
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

        {/* Карточки блюд */}
        {selectedCategory && (
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

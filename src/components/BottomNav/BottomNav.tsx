import { Home, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const BottomNav = () => {
  const [active, setActive] = useState("home");

  const navItems = [
    { id: "home", label: "Домой", icon: Home },
    { id: "search", label: "Поиск", icon: Search },
    { id: "profile", label: "Профиль", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-2">
      <div className="flex justify-around">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 transition",
              active === id && "text-primary"
            )}
          >
            <Icon size={24} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

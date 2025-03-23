import { Grid, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {Admin} from "../Admin/Admin";
import {CategoryDetails} from "../CategoryDetalis/CategoryDetalis";

const BottomNav = () => {
  const [active, setActive] = useState("category");

  const navItems = [
    { id: "category", label: "Категории", icon: Grid },
    { id: "foods", label: "Блюда", icon: Utensils },
  ];

  return (
    <div className="min-h-screen pb-14">
      <div className="p-4">
        {active === "category" && < Admin/>}
        {active === "foods" && < CategoryDetails />}
      </div>

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
    </div>
  );
};

export default BottomNav;

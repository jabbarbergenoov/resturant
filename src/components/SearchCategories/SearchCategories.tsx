import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface SearchCategoriesProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  onSubmit: (selectedCategories: Category[]) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({
  categories,
  onSelect,
  onSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCategories(filtered);
      setHighlightedIndex(0);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  const handleSelect = (category: Category) => {
    if (!selectedCategories.some((cat) => cat.id === category.id)) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      onSelect(category);
      onSubmit(newCategories); // ✅ Передаём актуальный список выбранных категорий
    }
    setSearchTerm("");
  };

  const removeCategory = (id: number) => {
    const newCategories = selectedCategories.filter((cat) => cat.id !== id);
    setSelectedCategories(newCategories);
    onSubmit(newCategories); // ✅ Обновляем список после удаления
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Поиск категорий..."
        className="w-full p-2 border mt-2 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
      />
      <AnimatePresence>
        {searchTerm && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-10 w-full mt-2 bg-white border rounded-lg shadow-lg dark:bg-gray-700"
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <motion.li
                  key={cat.id}
                  className={`p-2 cursor-pointer transition ${
                    highlightedIndex === index
                      ? "bg-blue-100 dark:bg-gray-500"
                      : ""
                  }`}
                  onClick={() => handleSelect(cat)}
                >
                  {cat.name}
                </motion.li>
              ))
            ) : (
              <li className="p-2 text-gray-500">Категории не найдены</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedCategories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center bg-blue-100 px-2 py-1 rounded-full"
          >
            <span className="text-gray-900">{cat.name}</span>
            <button
              className="ml-2 text-red-600"
              onClick={() => removeCategory(cat.id)}
            >
              <X size={16} color="red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchCategories;

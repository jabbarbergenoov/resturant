import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Category {
  id: number;
  name: string;
}

interface SearchCategoriesProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({ categories, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
      setHighlightedIndex(0);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % filteredCategories.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) =>
        prev === 0 ? filteredCategories.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && filteredCategories[highlightedIndex]) {
      handleSelect(filteredCategories[highlightedIndex]);
    }
  };

  const handleSelect = (category: Category) => {
    if (!selectedCategories.some((cat) => cat.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setSearchTerm("");
    onSelect(category);
  };

  const removeCategory = (id: number) => {
    setSelectedCategories(selectedCategories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("search_placeholder")}
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
                    highlightedIndex === index ? "bg-blue-100 dark:bg-gray-500" : ""
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(cat)}
                  dangerouslySetInnerHTML={{
                    __html: cat.name.replace(
                      new RegExp(`(${searchTerm})`, "gi"),
                      (match) => `<span class='font-bold text-blue-600 dark:text-white'>${match}</span>`
                    ),
                  }}
                ></motion.li>
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

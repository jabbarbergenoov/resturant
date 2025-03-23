import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal/Modal";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import FoodImage from "../FoodImage/FoodImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropDown";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { usePostRequest } from "../hooks/usePostRequest";
interface Category {
  id: number;
  name_uz?: string;
  name_kr?: string;
  name_ru?: string;
  name_en?: string;
  created_at: string;
  updated_at: string;
}

export function CategoryDetails() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hiddenCategories, setHiddenCategories] = useState<number[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<{
    names?: {
      ru: string;
      en: string;
      uz: string;
      kr: string;
    };
    descriptions?: {
      ru: string;
      en: string;
      uz: string;
      kr: string;
    };
    images?: string[];
    price?: number;
    categories?: number[];
  }>({
    names: { ru: "", en: "", uz: "", kr: "" },
    descriptions: { ru: "", en: "", uz: "", kr: "" },
    images: [],
    price: 0,
    categories: [],
  });
  const token = localStorage.getItem("accessToken");
  const lang = localStorage.getItem("i18nextLng") || "en";

  const {
    data: categoriesList = [],
    loading,
    error,
    refetch,
  } = useFetch<Category[]>("http://16.171.7.103:8000/categorie", {
    lang_code: lang,
  });

  const {
    data: foods,
    loading: foodsLoading,
    error: foodsError,
    refetch: foodsRefetch,
  } = useFetch("http://16.171.7.103:8000/food", {
    lang_code: lang,
  });

  const checkScrollTop = () => {
    if (!showScrollButton && window.pageYOffset > 200) {
      setShowScrollButton(true);
    } else if (showScrollButton && window.pageYOffset <= 200) {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollButton]);

  const filteredCategories = categoriesList
    ? categoriesList.filter((cat) =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  useEffect(() => {
    console.log("Categories List:", categoriesList);
    console.log("Filtered Categories:", filteredCategories);
  }, [categoriesList, filteredCategories]);

  const { postRequest } = usePostRequest("http://16.171.7.103:8000/food");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://16.171.7.103:8000/categorie/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchCategory();
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name.startsWith("name_")) {
        return {
          ...prev,
          names: { ...prev.names, [name.split("_")[1]]: value },
        };
      }
      if (name.startsWith("description_")) {
        return {
          ...prev,
          descriptions: { ...prev.descriptions, [name.split("_")[1]]: value },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    if (!selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds((prev) => [...prev, categoryId]);
    }

    setHiddenCategories((prev) => [...prev, categoryId]);
  };

  const handleCategoryRemove = (categoryId: number) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  };

  const uploadImages = async () => {
    if (!formData?.images || formData.images.length === 0) {
      console.error("❌ Ошибка: Нет файлов для загрузки");
      return;
    }

    const formDataToSend = new FormData();

    formData.images.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await fetch("http://16.171.7.103:8000/food/image", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("✅ Server response:", data);
      return data;
    } catch (error) {
      console.error("❌ Ошибка при отправке запроса:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const newImages = [...(formData.images || []), ...files];

    if (newImages.length > 3) {
      console.error("Можно загрузить не более 3 изображений");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Data:", formData); // Log form data

    if (!formData.images?.length) {
      console.error("Ошибка: выберите изображение.");
      return;
    }

    try {
      const file = formData.images[0];
      const imageUrl = await uploadImages(file);

      if (!imageUrl) {
        console.error("Не удалось загрузить изображение.");
        return;
      }

      const requestData = {
        names: formData.names,
        descriptions: formData.descriptions,
        images: imageUrl,
        price: formData.price || 0,
        categories: selectedCategoryIds,
      };

      console.log("Request Data:", requestData); // Log request data

      await postRequest(requestData);

      setIsModalOpen(false);
      setFormData({
        names: { ru: "", en: "", uz: "", kr: "" },
        descriptions: { ru: "", en: "", uz: "", kr: "" },
        images: [],
        price: 0,
        categories: [],
      });
      foodsRefetch();
      setSelectedCategoryIds([]);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 pb-28 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">{t("Admin")}</h1>
        <div className="flex items-center gap-4">
          <DarkMode />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-gray-900" align="end">
              <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                {t("add_category")}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {" "}
                  {t("select_language")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {foods?.map((food) => (
        <Card key={food.id} className="dark:bg-gray-800 mt-10 relative">
          <CardHeader>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="overflow-x-auto flex gap-2">
                  {Array.isArray(food.images) && food.images.length > 0 ? (
                    food.images.length === 1 ? (
                      <FoodImage img={food.images[0]} token={token} />
                    ) : (
                      <Carousel className="w-full max-w-md">
                        <CarouselContent>
                          {food.images.map((img, index) => (
                            <CarouselItem key={index} className="p-2">
                              <FoodImage img={img} token={token} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>

                        {/* Стрелки */}
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-1 bg-white p-2 rounded-full shadow-md">
                          {"<"}
                        </CarouselPrevious>
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-1 bg-white p-2 rounded-full shadow-md">
                          {">"}
                        </CarouselNext>
                      </Carousel>
                    )
                  ) : (
                    <p>Нет изображений</p>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-0 right-0"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-gray-900" align="end">
                <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                  {t("edit_category")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  {t("delete_category")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <Typography
              variant="h4"
              className="border-t pt-2 dark:border-gray-700"
            >
              {food.name}
            </Typography>
            <Typography variant="p" className="text-gray-400">
              {food.description}
            </Typography>
            <Typography variant="p" className="text-gray-400">
              {food.price ? `${food.price} сум` : "Цена не указана"}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <button
        onClick={() => navigate("/admin")}
        className="mt-4 z-11 fixed left-[80%] bottom-[2%] bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("add_food")}
      >
        <form
          onSubmit={handleSubmit}
          className="h-90 overflow-y-scroll space-y-6 p-4"
        >
          {/* Поле поиска */}
          <div className="mb-6">
            <label
              htmlFor="search"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("search_category")}
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск категории"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                🔍
              </span>
            </div>
          </div>

          {/* Блок выбранных категорий */}
          {selectedCategoryIds.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategoryIds.map((categoryId) => {
                    const category = categoriesList.find(
                      (cat) => cat.id === categoryId,
                    );
                    return (
                      category && (
                        <div
                          key={category.id}
                          className="flex items-center gap-2 bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full"
                        >
                          <span className="text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                          <button
                            onClick={() => handleCategoryRemove(category.id)}
                            className="text-red-600 hover:text-red-700 transition"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="fixed w-full">
            <AnimatePresence>
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed z-10 w-[60%] top-53 mt-2 bg-white rounded-lg shadow-lg"
                >
                  <div className="max-h-40 overflow-y-auto p-0">
                    {loading ? (
                      <div className="text-center py-4">Загрузка...</div>
                    ) : error ? (
                      <div className="text-center py-4 text-red-600">
                        Ошибка: {error.message}
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        Категории не найдены
                      </div>
                    ) : (
                      filteredCategories.map((cat) =>
                        !hiddenCategories.includes(cat.id) ? (
                          <motion.div
                            key={cat.id}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div
                              onClick={() => handleCategorySelect(cat.id)}
                              className={`p-3 cursor-pointer rounded-lg transition-colors ${
                                selectedCategoryIds.includes(cat.id)
                                  ? "bg-blue-100 dark:bg-blue-800"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-600"
                              }`}
                            >
                              <span className="text-gray-900 dark:text-white">
                                {cat.name}
                              </span>
                            </div>
                          </motion.div>
                        ) : null,
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Поля для названий */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name_ru"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("name_ru")}
              </label>
              <input
                id="name_ru"
                name="name_ru"
                value={formData.names?.ru || ""}
                onChange={handleChange}
                required
                placeholder="Введите название"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="name_en"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("name_en")}
              </label>
              <input
                id="name_en"
                name="name_en"
                value={formData.names?.en || ""}
                onChange={handleChange}
                required
                placeholder="Введите название"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="name_kr"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("name_kr")}
              </label>
              <input
                id="name_kr"
                name="name_kr"
                value={formData.names?.kr || ""}
                onChange={handleChange}
                required
                placeholder="Введите название"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          {/* Поля для описаний */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="description_uz"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("description_uz")}
              </label>
              <input
                id="description_uz"
                name="description_uz"
                value={formData.descriptions?.uz || ""}
                onChange={handleChange}
                required
                placeholder="Введите описание"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description_ru"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("description_ru")}
              </label>
              <input
                id="description_ru"
                name="description_ru"
                value={formData.descriptions?.ru || ""}
                onChange={handleChange}
                required
                placeholder="Введите описание"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description_en"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("description_en")}
              </label>
              <input
                id="description_en"
                name="description_en"
                value={formData.descriptions?.en || ""}
                onChange={handleChange}
                required
                placeholder="Введите описание"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="description_kr"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("description_kr")}
              </label>
              <input
                id="description_kr"
                name="description_kr"
                value={formData.descriptions?.kr || ""}
                onChange={handleChange}
                required
                placeholder="Введите описание"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          {/* Поле для изображений */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {t("images")}
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
            />

            {/* Превью изображений */}
            <div className="flex gap-2 mt-2">
              {formData.images?.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Поле для цены */}
          <div className="mb-6">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("price")}
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price || ""}
              onChange={handleChange}
              required
              placeholder="Введите цену"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 font-semibold hover:bg-gray-400 transition"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
            >
              {t("add")}
            </button>
          </div>
        </form>
      </Modal>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="mt-4 fixed left-[80%] bottom-[10%] z-10 bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

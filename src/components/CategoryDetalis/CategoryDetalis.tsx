import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DarkMode from "../DarkMode/DarkMode";
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal/Modal";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { MoreVertical } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { ArrowUp ,ChevronLeft} from "lucide-react";
import FoodImage from "../FoodImage/FoodImage";
import { LoaderCircle } from "lucide-react";
import { Input } from "../ui/input";
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
import SearchCategories from "../SearchCategories/SearchCategories";

interface Food {
  id: number | string;
  images: string[];
  name: string;
  description: string;
  price?: number;
}

interface Category {
  id: number;
  name_uz?: string;
  name_kr?: string;
  name_ru?: string;
  name_en?: string;
  created_at: string;
  updated_at: string;
  name: string;
}

interface FormData {
  names: {
    ru: string;
    en: string;
    uz: string;
    kr: string;
  };
  descriptions: {
    ru: string;
    en: string;
    uz: string;
    kr: string;
  };
  images?: (string | File)[];
  price?: number;
  categories?: number[];
}

export function CategoryDetails() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, _] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [fileNames, setFileNames] = useState(t('noSelect'));

  const handleFileSelect = (event:any) => {
    if (event.target.files.length > 0) {
      setFileNames([...event.target.files].map((file) => file.name).join(", "));
    } else {
      setFileNames(t('noSelect'));
    }
    handleImageChange(event); 
  };
  const [formData, setFormData] = useState<FormData>({
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
  } = useFetch<Category[]>("https://techflow.duckdns.org/api/categorie", {
    lang_code: lang,
  });

  const {
    data: foods,
    loading: foodsLoading,
    error: foodsError,
    refetch: foodsRefetch,
  } = useFetch<Food[]>("https://techflow.duckdns.org/api/food", {
    lang_code: lang,
    name: search
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

  const { postRequest } = usePostRequest("https://techflow.duckdns.org/api/food");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `https://techflow.duckdns.org/api/categorie/${id}`,
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

  // const handleCategorySelect = (categoryId: number) => {
    
  //   if (!selectedCategoryIds.includes(categoryId)) {
  //     setSelectedCategoryIds((prev) => [...prev, categoryId]);
  //   }

  //   setHiddenCategories((prev) => [...prev, categoryId]);
  // };

  // const handleCategoryRemove = (categoryId: number) => {
  //   setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  // };


  const uploadImages = async (
    //@ts-ignore
    files: File[],
  ) => {
    if (!formData?.images || formData.images.length === 0) {
      console.error("❌ Ошибка: Нет файлов для загрузки");
      return;
    }

    const formDataToSend = new FormData();

    formData.images.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await fetch("https://techflow.duckdns.org/api/food/image", {
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
      const files = formData.images.filter(
        (img): img is File => img instanceof File,
      );
      const imageUrl = await uploadImages(files);

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
                {t("add_food")}
              </DropdownMenuItem>
              <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex  items-center w-full [&>*:last-child]:hidden">
                  <ChevronLeft className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                  {t("select_language")}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-gray-900">
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
      <div className="flex-grow">
        <div className="flex justify-end gap-5 mt-5 mb-5">
          <Input
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full dark:bg-gray-800"
          />
        </div>
      </div>
      {foodsLoading ? (
        <div className="flex justify-center items-center h-40">
          <LoaderCircle className="animate-spin text-gray-500" size={32} />
        </div>
      ) : foodsError ? (
        <div className="text-center text-red-600">{foodsError}</div>
      ) : (
        foods?.map((food) => (
          <Card key={food.id} className="dark:bg-gray-800 mt-10 relative">
            <CardHeader>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                  <div className="overflow-x-auto flex gap-2">
                    {Array.isArray(food.images) && food.images.length > 0 ? (
                      food.images.length === 1 ? (
                        <FoodImage
                          img={food.images[0]}
                          //@ts-ignore
                          token={token}
                        />
                      ) : (
                        <Carousel className="w-full max-w-md">
                          <CarouselContent>
                            {food.images.map((img, index) => (
                              <CarouselItem
                                key={index}
                                className="p-2 flex justify-center"
                              >
                                <FoodImage
                                  img={img}
                                  //@ts-ignore
                                  token={token}
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>

                          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-1 text-white bg-yellow-500 p-2 dark:text-white dark:bg-yellow-500 rounded-full shadow-md">
                            {"<"}
                          </CarouselPrevious>
                          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-1 text-white bg-yellow-500 dark:text-white dark:bg-yellow-500 p-2 rounded-full shadow-md">
                            {">"}
                          </CarouselNext>
                        </Carousel>
                      )
                    ) : (
                      <p>{t('notImage')}</p>
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
                    {t("edit_foods")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    {t("delete_food")}
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
                {food.price ? `${food.price} ${t('sum')}` : t("Price")}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("add_food")}
      >
        <form
          onSubmit={handleSubmit}
          className="h-120 overflow-y-scroll space-y-6 p-4"
        >

          <label className="mb-10">
            {t('addCategory')}
          </label>
          <SearchCategories
          //@ts-ignore
          categories={categoriesList} 
          //@ts-ignore
          onSelect={selectedCategoryIds} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name_uz"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("name_uz")}
              </label>
              <input
                id="name_uz"
                name="name_uz"
                value={formData.names?.uz || ""}
                onChange={handleChange}
                required
                placeholder={t('enterName')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
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
                placeholder={t('enterName')}
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
                placeholder={t('enterName')}
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
                placeholder={t('enterName')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor={t('description_uz')}
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
                placeholder={t('enterDescraption')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={t("description_ru")}
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
                placeholder={t('enterDescraption')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={t("description_en")}
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
                placeholder={t('enterDescraption')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={t("description_kr")}
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
                placeholder={t('enterDescraption')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
          <div className="flex flex-col gap-2">
      <label className="cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-center">
       {t('selectImages')}
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </label>
      <span className="text-gray-400 text-sm">{fileNames}</span>
    </div>

            <div className="flex gap-2 mt-2">
              {formData.images?.map((file, index) => (
                <div key={index} className="relative">
                  {file instanceof File ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={file}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  )}
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
              placeholder={t('enterPrice')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
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
          className="fixed bottom-19 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

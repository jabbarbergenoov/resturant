import { useState, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { usePatchRequest } from "../hooks/usePatch";
import { usePostRequest } from "../hooks/usePostRequest";
import DarkMode from "../DarkMode/DarkMode";
import { useFetch } from "../hooks/useFetch";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Loader, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropDown";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import trash from "/trash.svg";
import pencil from "/pencil.svg";

interface Category {
  id: number;
  name_uz?: string;
  name_kr?: string;
  name_ru?: string;
  name_en?: string;
  created_at: string;
  updated_at: string;
}

export function Admin() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [_, setCategories] = useState<Category[]>([]);
  const [searchField, __] = useState("name");
  const lang = localStorage.getItem("i18nextLng") || "en";
  const {
    data: categorieData,
    loading,
    error,
    refetch,
  } = useFetch<
    { id: number; name: string; created_at: string; updated_at: string }[]
  >("http://16.171.7.103:8000/categorie", {
    lang_code: lang,
    [searchField]: search,
  });

  const { patchRequest, loading: patchLoading } = usePatchRequest(
    "http://16.171.7.103:8000/categorie",
  );

  const { postRequest } = usePostRequest("http://16.171.7.103:8000/categorie");
  const [formData, setFormData] = useState<{
    id?: number | undefined;
    name_uz: string;
    name_kr: string;
    name_ru: string;
    name_en: string;
  }>({
    name_uz: "",
    name_kr: "",
    name_ru: "",
    name_en: "",
  });

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ru.trim()) {
      alert("name_ru обязательно!");
      return;
    }

    const requestData = {
      ...(formData.name_uz && { uz: formData.name_uz }),
      ...(formData.name_kr && { kr: formData.name_kr }),
      ...(formData.name_ru && { ru: formData.name_ru }),
      ...(formData.name_en && { en: formData.name_en }),
    };
    try {
      await postRequest(requestData);
      setIsModalOpen(false);
      setFormData({ name_uz: "", name_kr: "", name_ru: "", name_en: "" });
      refetch();
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`http://16.171.7.103:8000/categorie/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        refetch();
      }

      if (!response.ok) {
        throw new Error("Ошибка при удалении");
      }

      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      id: category.id,
      //@ts-ignore
      name_uz: category.name_uz || null,
      //@ts-ignore
      name_kr: category.name_kr || null,
      //@ts-ignore
      name_ru: category.name_ru || null,
      //@ts-ignore
      name_en: category.name_en || null,
    });
    setIsEdit(true);
  };

  const handleUpdate = async (id: number, e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.error("Ошибка: ID не указан");
      return;
    }

    try {
      const requestData = {
        id: formData.id,
        names: {
          ru: formData.name_ru.trim(),
          en: formData.name_en.trim(),
          uz: formData.name_uz.trim(),
          kr: formData.name_kr.trim(),
        },
      };

      console.log("Отправляемые данные:", JSON.stringify(requestData, null, 2));

      await patchRequest(requestData);
      setIsEdit(false);
      refetch();
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleCardClick = (category: Category) => {
    navigate(`/category/${category.id}`);
  };

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

  return (
    <div className="p-6 min-h-screen ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">{t("Admin")}</h1>
        <div className="flex items-center gap-4">
          <DarkMode />
          <DropdownMenu>
            <DropdownMenuTrigger className="dark:bg-gray-900" asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-gray-900" align="end">
              <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                {t("add_category")}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex  items-center w-full [&>*:last-child]:hidden">
                  <ChevronLeft className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />

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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-grow">
        {" "}
        <div className="flex justify-end gap-5 mt-5 mb-5">
          <Input
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin w-10 h-10 text-gray-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorieData &&
            categorieData.map((e) => (
              <Card
                key={e.id}
                onClick={() => handleCardClick(e)}
                className="p-2 cursor-pointer dark:bg-gray-900 bg-white shadow-lg rounded-xl flex flex-col justify-between"
              >
                <CardHeader className="border-b pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      {e.name}
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                      ID: {e.id}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="mt-3 flex flex-col space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="font-medium">{t("created_at")}</span>
                    <span>{new Date(e.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span className="font-medium">{t("updated_at")}</span>
                    <span>{new Date(e.updated_at).toLocaleString()}</span>
                  </div>
                </CardContent>

                <CardFooter className="mt-4 flex justify-end gap-5">
                  <Button
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      //@ts-ignore
                      handleEdit(e.id);
                    }}
                    className="hover:bg-green-800 hover:text-white transition px-3 py-2 bg-green-700 rounded-lg flex items-center dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    <img
                      src={pencil}
                      alt="Edit"
                      className="w-4 h-4 filter invert"
                    />
                  </Button>
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(e.id);
                    }}
                    variant="outline"
                    className="hover:bg-red-800 bg-red-500 hover:text-white transition px-3 py-2 rounded-lg flex items-center dark:bg-red-500 dark:hover:bg-red-800"
                  >
                    <img
                      src={trash}
                      alt="Delete"
                      className="w-4 h-4  dark:filter invert"
                    />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("add_category")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={formData.name_uz}
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
              value={formData.name_kr}
              required
              onChange={handleChange}
              placeholder="Введите название"
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
              value={formData.name_ru}
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
              required
              id="name_en"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              placeholder="Введите название"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            {t("add")}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        title={t("edit_category")}
      >
        <form
          onSubmit={(e) => {
            if (formData.id !== undefined) {
              handleUpdate(formData.id, e);
            } else {
              console.error("Ошибка: ID не задан");
            }
          }}
          className="space-y-4"
        >
          <div className="mb-4">
            <label
              htmlFor="name_uz"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("name_uz")}
            </label>
            <Input
              id="name_uz"
              name="name_uz"
              value={formData.name_uz}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name_ru"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("name_ru")}
            </label>
            <Input
              id="name_ru"
              name="name_ru"
              value={formData.name_ru}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name_en"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("name_en")}
            </label>
            <Input
              id="name_en"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name_kr"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("name_kr")}
            </label>
            <Input
              id="name_kr"
              name="name_kr"
              value={formData.name_kr}
              onChange={handleChange}
              className="input dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            disabled={patchLoading}
          >
            {patchLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              t("save")
            )}
          </button>
        </form>
      </Modal>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

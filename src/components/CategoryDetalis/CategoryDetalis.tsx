import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DarkMode from '../DarkMode/DarkMode'
import { useTranslation } from "react-i18next";
import { Modal } from "../Modal/Modal";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import pizzaImg from '../../assets/images (1).jfif'
import { MoreVertical } from "lucide-react";
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
      const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const token = localStorage.getItem("accessToken");
  const { postRequest } = usePostRequest(
    "http://192.168.202.153:8000/categorie",
  );

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
            `http://192.168.202.153:8000/categorie/${id}`,
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ru.trim()) {
      alert("name_ru обязательно!");
      return;
    }

    const requestData = {
      ...(formData.name_uz && { name_uz: formData.name_uz }),
      ...(formData.name_kr && { name_kr: formData.name_kr }),
      ...(formData.name_ru && { name_ru: formData.name_ru }),
      ...(formData.name_en && { name_en: formData.name_en }),
    };
    try {
      await postRequest(requestData);
      setIsModalOpen(false);
      setFormData({ name_uz: "", name_kr: "", name_ru: "", name_en: "" });
    //   refetch();
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  return (
    <div className="p-6 h-[100%] relative">
        
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
            <DropdownMenuContent align="end">
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
      <Card className="dark:bg-gray-800 mt-10 relative">
        <CardHeader>
          <img src={pizzaImg} alt="" className="rounded-xl mt-2" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="absolute top-0 right-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                {t("edit_category")}
              </DropdownMenuItem>
              <DropdownMenuItem 
            //   onClick={handleDelete} 
              className="text-red-600">
                {t("delete_category")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Typography variant="h4" className="border-t pt-5 dark:border-gray-700">
Пеперенный
          </Typography>
          <Typography variant="p" className="text-gray-400">Жаренный сыр Моцарелла в кляре</Typography>
          <Typography variant="p" className="text-gray-400">15000сум</Typography>
        </CardContent>
      </Card>

      <button
        onClick={() => navigate("/admin")}
        className="mt-4 absolute left-[80%] bottom-[0%] bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

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
    </div>
  );
}
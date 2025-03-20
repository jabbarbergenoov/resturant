import { useState, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { usePatchRequest } from "../hooks/usePatch";
import { usePostRequest } from "../hooks/usePostRequest";
import DarkMode from "../DarkMode/DarkMode";
import { useFetch } from "../hooks/useFetch";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropDown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import trash from "/trash.svg";
import pencil from "/pencil.svg";

interface Category {
  id: number;
  name_uz: string;
  name_kr: string;
  name_ru: string;
  name_en: string;
  created_at: string;
  updated_at: string;
}

export function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchField, setSearchField] = useState("name"); // Поле для поиска

  const {
    data: categorieData,
    loading,
    error,
    refetch,
  } = useFetch<{ id: number; name: string }[]>(
    "http://192.168.202.153:8000/categorie",
    { lang_code: "en", [searchField]: search },
  );

  const { patchRequest, loading: patchLoading } = usePatchRequest(
    "http://192.168.202.153:8000/categorie",
  );

  const { postRequest } = usePostRequest(
    "http://192.168.202.153:8000/categorie",
  );
  const [formData, setFormData] = useState({
    name_uz: "",
    name_kr: "",
    name_ru: "",
    name_en: "",
  });

  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
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
      name_uz: formData.name_uz,
      ...(formData.name_kr && { name_kr: formData.name_kr }),
      ...(formData.name_ru && { name_ru: formData.name_ru }),
      ...(formData.name_en && { name_en: formData.name_en }),
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
      const token = localStorage.getItem("accessToken"); // Подставь реальный токен

      const response = await fetch(
        `http://192.168.202.153:8000/categorie/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        refetch();
      }

      if (!response.ok) {
        throw new Error("Ошибка при удалении");
      }

      // Удаляем элемент из состояния
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      id: category.id, // Теперь ID добавляется правильно
      name_uz: category.name_uz || "",
      name_kr: category.name_kr || "",
      name_ru: category.name_ru || "",
      name_en: category.name_en || "",
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
        id: formData.id, // ID включен в тело запроса
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
      refetch(); // Обновляем данные
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <DarkMode />
      </div>

      <div className="flex justify-end gap-5 mt-5 mb-5">
        <Input
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />

        {/* Выбор критерия поиска */}
        <Select
          onValueChange={(value) => {
            setSearchField(value);
            refetch();
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите поле поиска" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">По названию</SelectItem>
            <SelectItem value="id">По ID</SelectItem>
            <SelectItem value="id">По ID</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end mb-10">

        <select
          onChange={changeLanguage}
          value={i18n.language}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition dark:bg-gray-800 "
        >
          Добавить категорию
        </button>
      </div>


      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorieData &&
          categorieData.map((e) => (
            <Card
              key={e.id}
              className="p-2 dark:bg-gray-900 bg-white shadow-lg rounded-xl flex flex-col justify-between"
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
                  <span className="font-medium">Создано:</span>
                  <span>{new Date(e.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="font-medium">Обновлено:</span>
                  <span>{new Date(e.updated_at).toLocaleString()}</span>
                </div>
              </CardContent>

              <CardFooter className="mt-4 flex justify-end gap-5">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(e)}
                  className=" hover:bg-gray-200 hover:text-white transition px-3 py-2 rounded-lg flex items-center dark:bg-gray-900"
                >
                  <img
                    src={pencil}
                    alt="Edit"
                    className="w-4 h-4 mr-2 dark:filter dark:invert"
                  />
                </Button>
                <Button
                  onClick={() => handleDelete(e.id)}
                  variant="outline"
                  className=" hover:bg-gray-200 hover:text-white transition px-3 py-2 rounded-lg flex items-center dark:bg-gray-900"
                >
                  <img
                    src={trash}
                    alt="Edit"
                    className="w-4 h-4 mr-2 dark:filter dark:invert"
                  />
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Добавить категорию"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="name_uz"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Название (узбекский) *
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
              Название (karakalpak)
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
              Название (русский)
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
              Название (английский)
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
            Добавить
          </button>
        </form>
      </Modal>
      <Modal
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        title="Редактировать категорию"
      >
        <form
          onSubmit={(e) => handleUpdate(formData.id, e)}
          className="space-y-4"
        >
          <div className="mb-4">
            <label
              htmlFor="name_uz"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Название (узбекский) *
            </label>
            <Input
              id="name_uz"
              name="name_uz"
              value={formData.name_uz}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name_ru"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Название (русский) *
            </label>
            <Input
              id="name_ru"
              name="name_ru"
              value={formData.name_ru}
              onChange={handleChange}
              required
              className="input"
            />

            <label
              htmlFor="name_en"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Название (English) *
            </label>
            <Input
              id="name_en"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              required
              className="input"
            />

            <label
              htmlFor="name_kr"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Название (Karakalpak) *
            </label>
            <Input
              id="name_kr"
              name="name_kr"
              value={formData.name_kr}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Сохранить
          </button>
        </form>
      </Modal>
    </div>
  );
}

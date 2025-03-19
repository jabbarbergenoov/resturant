import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { usePostRequest } from "../hooks/usePostRequest"; // Хук для POST-запроса
import DarkMode from "../DarkMode/DarkMode";

export function Admin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { postRequest } = usePostRequest("http://192.168.202.153:8000/categorie"); // Хук для POST-запроса
  const [formData, setFormData] = useState({
    name_uz: "",
    name_kr: "",
    name_ru: "",
    name_en: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_ru.trim()) {
      alert("name_uz обязательно!");
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
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-4">Admin</h1>
              <DarkMode/>
      </div>
      

      
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Добавить категорию
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить категорию">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
            <label htmlFor="name_uz" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Название (узбекский) *
            </label>
            <input
              id="name_uz"
              name="name_uz"
              value={formData.name_uz}
              onChange={handleChange}
              placeholder="Введите название"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name_kr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
            <label htmlFor="name_ru" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Название (русский)
            </label>
            <input
              id="name_ru"
              name="name_ru"
              value={formData.name_ru}
              onChange={handleChange}
              placeholder="Введите название"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name_en" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
     
    </div>
  );
}

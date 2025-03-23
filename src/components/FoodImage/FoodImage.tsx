import { useEffect, useState } from "react";

const FoodImage = ({ img, token }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!img) return; // Если img не передан, ничего не делать

    const fetchImage = async () => {
      try {
        const url = `http://16.171.7.103:8000/food/image/${img}`;

        console.log("Отправляем GET-запрос:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Ошибка загрузки изображения: ${response.status} - ${await response.text()}`,
          );
        }

        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
      }
    };

    fetchImage();
  }, [img, token]);

  return imageSrc ? (
    <img
      src={imageSrc}
      alt="Food"
      className="p-3 rounded-2xl w-full object-cover flex-shrink-0"
    />
  ) : (
    <p>Загрузка...</p>
  );
};

export default FoodImage;

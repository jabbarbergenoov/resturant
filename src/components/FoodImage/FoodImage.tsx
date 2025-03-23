import { useEffect, useState } from "react";

interface FoodImageProps {
  img: string;
  token: string;
}

const FoodImage:React.FC<FoodImageProps> = ({ img, token }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!img) return; 

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
  className="rounded-[20px] p-2 w-full h-[250px] object-cover object-center"
/>


  ) : (
    <p>Загрузка...</p>
  );
};

export default FoodImage;

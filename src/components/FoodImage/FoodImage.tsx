import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface FoodImageProps {
  img: string;
  token: string;
}

const FoodImage: React.FC<FoodImageProps> = ({ img, token }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!img) return;

    const fetchImage = async () => {
      try {
        const url = `https://techflow.duckdns.org/food/image/${img}`;

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
    <Loader className="animate-spin w-10 h-10 text-gray-500" />
  );
};

export default FoodImage;

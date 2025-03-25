import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import FoodImage from "../FoodImage/FoodImage";

type CardProps = {
  name: string;
  description: string;
  price: string;
  images?: string[];
  token: string;
};

export function Card({
  name,
  description,
  price,
  images = [],
  token,
}: CardProps) {
  return (
    <ShadCard className="overflow-hidden shadow-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-700">
      <CardHeader className="relative">
        {images.length > 1 ? (
          <Carousel className="w-full max-w-md overflow-visible"
          //@ts-ignore
          dots>
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index} className="p-2">
                  <FoodImage img={img} token={token} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="absolute left-1/2 -translate-x-1/2 flex space-x-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
                ></span>
              ))}
            </div>
          </Carousel>
        ) : images.length === 1 ? (
          <FoodImage img={images[0]} token={token} />
        ) : (
          <p className="text-gray-400 dark:text-gray-500">Нет изображений</p>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl text-gray-900 dark:text-white">
          {name}
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          {description}
        </CardDescription>
        <p className="text-yellow-500 dark:text-yellow-400 font-bold">
          {price} sum
        </p>
      </CardContent>
    </ShadCard>
  );
}

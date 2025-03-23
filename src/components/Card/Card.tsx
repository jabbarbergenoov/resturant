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
  CarouselPrevious,
  CarouselNext,
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
    <ShadCard className="overflow-hidden shadow-md dark:bg-gray-800">
      <CardHeader className="relative">
        {images.length > 1 ? (
          <Carousel className="w-full max-w-md overflow-visible">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index} className="p-2">
                  <FoodImage img={img} token={token} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white p-2 rounded-full shadow-md dark:bg-gray-700">
              {"<"}
            </CarouselPrevious>
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white p-2 rounded-full shadow-md dark:bg-gray-700">
              {">"}
            </CarouselNext>
          </Carousel>
        ) : images.length === 1 ? (
          <FoodImage img={images[0]} token={token} />
        ) : (
          <p className="text-gray-400">Нет изображений</p>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
        <p className="text-yellow-500 font-bold">{price} sum</p>
      </CardContent>
    </ShadCard>
  );
}

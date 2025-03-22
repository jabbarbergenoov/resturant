import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type CardProps = {
  name: string;
  description: string;
  price: string;
  img?: string;
};

export function Card({ name, description, price, img }: CardProps) {
  return (
    <ShadCard className="overflow-hidden shadow-md dark:bg-gray-800">
      <CardHeader>
        {img && (
          <img
            src={img}
            alt={name}
            className="w-full object-cover rounded-xl"
          />
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
        <p className="text-gray-400 dark:text-blue-400 font-bold">{price}</p>
      </CardContent>
    </ShadCard>
  );
}

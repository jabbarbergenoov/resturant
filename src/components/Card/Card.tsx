type Card = {
  name: string;
  description: string;
  price: string;
};

export function Card({ name, description, price }: Card) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 transition-all">
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
        {name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
      <p className="text-blue-700 dark:text-blue-400 font-bold mt-2">{price}</p>
    </div>
  );
}

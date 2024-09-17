let mealkits = [
  {
    title: "Farfalle Pesto Pasta",
    include:
      "Farfalle pasta, basil pesto sauce, cherry tomatoes, and parmesan cheese and fresh spinach.",
    description:
      "Farfalle Pesto Pasta is pasta that is tossed in a basil pesto sauce and served with cherry tomatoes and parmesan cheese.",
    category: "Classic Meals",
    price: 10.99,
    cookingTime: 30,
    serving: 2,
    imageUrl: "/img/card-2.jpg",
    featuredMealKit: true,
  },
  {
    title: "Fresh Spring Rolls",
    include:
      "Shrimp & pork belly, fresh greens, rice noodles, and a peanut sauce all wrapped up in rice paper.",
    description:
      "Fresh Spring Rolls are a healthy, delicious and easy to make meal. They are perfect for a light lunch, dinner, or appetizer!",
    category: "Healthy Meals",
    price: 9.99,
    cookingTime: 15,
    serving: 2,
    imageUrl: "/img/card-1.jpg",
    featuredMealKit: true,
  },
  {
    title: "Butter Chicken",
    include:
      "Boneless chicken thighs, pre-made butter sauce, onions, a variety of spices, rice, and bonus rotis.",
    description:
      "Butter Chicken is a delicious Indian dish made with tender chicken pieces cooked in a rich, creamy tomato sauce.",
    category: "Classic Meals",
    price: 11.99,
    cookingTime: 30,
    serving: 2,
    imageUrl: "/img/card-3.jpg",
    featuredMealKit: true,
  },
  {
    title: "Poke Bowl",
    include:
      "Rice, protein, vegetables and 2 types of sauce (customized as you prefer).",
    description:
      "Poke Bowl is a traditional Hawaiian dish made with fresh, raw fish, rice, and a variety of vegetables.",
    category: "Healthy Meals",
    price: 12.99,
    cookingTime: 20,
    serving: 2,
    imageUrl: "/img/card-4.jpg",
    featuredMealKit: false,
  },
  {
    title: "Tacos",
    include:
      "Ground beef, taco seasoning, tortillas, avocado,limes and a variety of toppings.",
    description:
      "Tacos are a delicious and easy to make meal that is perfect for a quick and easy dinner. You can customize them with your favorite toppings.",
    category: "Classic Meals",
    price: 10.99,
    cookingTime: 10,
    serving: 2,
    imageUrl: "/img/card-5.jpg",
    featuredMealKit: false,
  },
  {
    title: "Pad Thai",
    include:
      "Rice noodles, shrimp, tofu, peanuts, fresh bean sprouts and a variety of other vegetables.",
    description:
      "Pad Thai is a classic Thai dish made with rice noodles, shrimp, tofu, peanuts, and a variety of vegetables.",
    category: "Classic Meals",
    price: 12.99,
    cookingTime: 20,
    serving: 2,
    imageUrl: "/img/card-6.jpg",
    featuredMealKit: false,
  },
];
module.exports.getAllMealKits = function () {
  return mealkits;
};

module.exports.getFeaturedMealKits = function (mealkits) {
  const featuredMealSet = [];
  mealkits.forEach((meal) => {
    if (meal.featuredMealKit) featuredMealSet.push(meal);
  });
  return featuredMealSet;
};

module.exports.getMealKitByCategory = function (mealkits) {
  let categorizedMealKitsObj = {};

  mealkits.forEach((mealKit) => {
    if (!categorizedMealKitsObj[mealKit.category]) {
      categorizedMealKitsObj[mealKit.category] = [];
    }
    categorizedMealKitsObj[mealKit.category].push(mealKit);
  });

  let categorizedMealKitsArray = Object.keys(categorizedMealKitsObj).map(
    (categoryName) => {
      return {
        categoryName: categoryName,
        mealKits: categorizedMealKitsObj[categoryName],
      };
    }
  );

  return categorizedMealKitsArray;
};

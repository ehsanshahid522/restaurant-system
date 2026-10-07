(function(root) {
  var menu = [
  {
    "id": "deal-1",
    "name": "Deal 1",
    "category": "Deals",
    "description": "Zinger Burger, Regular Fries, Tin Pack",
    "price": 549,
    "badge": "Hot Deal 🔥",
    "image": "assets/food/deal_solo.jpg",
    "emoji": "🍔"
  },
  {
    "id": "deal-2",
    "name": "Deal 2",
    "category": "Deals",
    "description": "Patty Burger, Regular Fries, Tin Pack",
    "price": 449,
    "badge": "Saver Deal",
    "image": "assets/food/deal_duo.jpg",
    "emoji": "🍔"
  },
  {
    "id": "deal-3",
    "name": "Deal 3",
    "category": "Deals",
    "description": "Small Pizza, 5 Hot Wings, Tin Pack",
    "price": 949,
    "badge": "Pizza Combo",
    "image": "assets/food/deal_duo.jpg",
    "emoji": "🍕"
  },
  {
    "id": "deal-4",
    "name": "Deal 4",
    "category": "Deals",
    "description": "Medium Pizza, Zinger Burger, Patty Burger, 1 Litre Drink",
    "price": 1699,
    "badge": "Popular",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🍕"
  },
  {
    "id": "deal-5",
    "name": "Deal 5",
    "category": "Deals",
    "description": "Large Pizza, 10 Hot Wings, 1 Litre Drink",
    "price": 1999,
    "badge": "Wings & Pizza",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🍕"
  },
  {
    "id": "deal-6",
    "name": "Deal 6",
    "category": "Deals",
    "description": "10 Hot Wings, Tin Pack",
    "price": 649,
    "badge": "Wings Deal",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🍗"
  },
  {
    "id": "deal-7",
    "name": "Deal 7",
    "category": "Deals",
    "description": "2 Large Pizza, 1.5 Litre Drink",
    "price": 2899,
    "badge": "Twin Large",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🍕"
  },
  {
    "id": "deal-fam-1",
    "name": "Family Deal",
    "category": "Deals",
    "description": "2 Sp Large Pizza, 1 Sp Medium Pizza, 20 Hot Wings, 2x 1.5 Litre Drink",
    "price": 5000,
    "badge": "Mega Family",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🎉"
  },
  {
    "id": "deal-fam-2",
    "name": "Family Deal 2",
    "category": "Deals",
    "description": "6 Zinger Burger, 2 Fries, 10 Hot Wings, 1.5 Litre Drink",
    "price": 3399,
    "badge": "Burger Feast",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🍔"
  },
  {
    "id": "deal-kids",
    "name": "Kids Deal",
    "category": "Deals",
    "description": "Popcorn Chicken, 5 Hot Wings, 5 Nuggets, 1 Medium Plain Fries, 1 Litre Drink",
    "price": 1149,
    "badge": "Kids Special 🧒",
    "image": "assets/food/deal_solo.jpg",
    "emoji": "🍟"
  },
  {
    "id": "deal-super-fam",
    "name": "Super Family Deal",
    "category": "Deals",
    "description": "3 Special Large Pizza, 2 Spin Roll Deal, 2 Loaded Fries, 1 Popcorn Chicken, 1 Family Fries, 1.5 Litre Drink, 3 Dip Sauce",
    "price": 5999,
    "badge": "Grand Feast 👑",
    "image": "assets/food/deal_party.jpg",
    "emoji": "🍕"
  },
  {
    "id": "deal-wehshi",
    "name": "Wehshi Deal",
    "category": "Deals",
    "description": "1 Crave X Sp Large Pizza, 1 Crave X Sp F1 Pasta, 1 Zinger Burger, 1.5 Litre Drink",
    "price": 1999,
    "badge": "Wehshi Special 🔥",
    "image": "assets/food/deal_solo.jpg",
    "emoji": "🔥"
  },
  {
    "id": "deal-crave-x",
    "name": "Crave X Deal",
    "category": "Deals",
    "description": "1 Large Pizza Special, 1 F1 Pasta Special, 5 Hot Wings, 1.5 Litre Drink",
    "price": 1999,
    "badge": "Chef Choice ⭐",
    "image": "assets/food/deal_solo.jpg",
    "emoji": "⭐"
  },
  {
    "id": "meal-1",
    "name": "Meal 1",
    "category": "Deals",
    "description": "5 Zinger Burgers, 1.5 Litre Drink",
    "price": 1949,
    "badge": "Bestseller 🔥",
    "image": "assets/food/deal_solo.jpg",
    "emoji": "🍔"
  },
  {
    "id": "meal-2",
    "name": "Meal 2",
    "category": "Deals",
    "description": "Sp Large Pizza, 2 Petty Burgers, 2 Chapli Burgers, 2 Zinger Burger, 15 Hot Wings, 1.5 Litre Drink",
    "price": 4199,
    "badge": "Ultimate Meal",
    "image": "assets/food/deal_duo.jpg",
    "emoji": "👑"
  },
  {
    "id": "meal-3",
    "name": "Meal 3",
    "category": "Deals",
    "description": "Sp Medium Pizza, 5 Nuggets, 5 Hot Wings, Sp Pasta/Fries, 1.5 Litre Drink",
    "price": 2399,
    "badge": "Combo Meal",
    "image": "assets/food/deal_duo.jpg",
    "emoji": "🍝"
  },
  {
    "id": "meal-4",
    "name": "Meal 4",
    "category": "Deals",
    "description": "2 Sp Large Pizza, 2 Petty Burger, 2 Zinger Burger, 2 Sp Pasta, 1.5 Litre Drink",
    "price": 5200,
    "badge": "Jumbo Feast",
    "image": "assets/food/deal_solo.jpg",
    "emoji": "🍕"
  },
  {
    "id": "platter-basic",
    "name": "Basic Platter",
    "category": "Platters",
    "description": "Spin Roll (4 Pieces), B.B.Q Wings (5 Pieces), Fries, Dip Sauce",
    "price": 900,
    "badge": "Platter",
    "image": "assets/food/platter_feast.jpg",
    "emoji": "🍱"
  },
  {
    "id": "platter-bbq",
    "name": "B.B.Q Platter",
    "category": "Platters",
    "description": "Spin Roll (4 Pieces), B.B.Q Wing (5 Pieces), Kebab (4 Pieces), Fries, Dip Sauce",
    "price": 1100,
    "badge": "Bestseller Platter",
    "image": "assets/food/platter_feast.jpg",
    "emoji": "🍱"
  },
  {
    "id": "platter-golden",
    "name": "Golden Platter",
    "category": "Platters",
    "description": "Spin Roll (4 Pieces), Hot Wings (5 Pieces), Fries, Dip Sauces",
    "price": 850,
    "badge": "Crispy Platter",
    "image": "assets/food/platter_feast.jpg",
    "emoji": "🍱"
  },
  {
    "id": "platter-chatpata",
    "name": "Chat Pata Platter",
    "category": "Platters",
    "description": "Chat Pata Spin Roll, Chat Pata Wings, Chat Pata Fries, Chat Pata Sauces",
    "price": 1100,
    "badge": "Chat Pata 🌶️",
    "image": "assets/food/platter_feast.jpg",
    "emoji": "🌶️"
  },
  {
    "id": "pz-fajita",
    "name": "Chicken Fajita Pizza",
    "category": "Pizza",
    "description": "Mexican fajita chicken, crunchy bell peppers, sweet corn, oregano & double mozzarella",
    "sizes": {
      "Small": 500,
      "Medium": 900,
      "Large": 1300,
      "XL": 1750
    },
    "badge": "Popular",
    "image": "assets/food/pizza_fajita.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-supreme",
    "name": "Chicken Supreme Pizza",
    "category": "Pizza",
    "description": "Tender chicken chunks, smoked sausages, black olives, onions, mushrooms & melted mozzarella",
    "sizes": {
      "Small": 500,
      "Medium": 900,
      "Large": 1300,
      "XL": 1750
    },
    "badge": "Supreme",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-tandoori",
    "name": "Chicken Tandoori Pizza",
    "category": "Pizza",
    "description": "Rich tandoori spiced chicken, red onions, fresh coriander, green chilies & gooey mozzarella",
    "sizes": {
      "Small": 500,
      "Medium": 900,
      "Large": 1300,
      "XL": 1750
    },
    "badge": "Spicy 🔥",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-tikka",
    "name": "Chicken Tikka Pizza",
    "category": "Pizza",
    "description": "Traditional tandoori chicken tikka cubes, onions, pure mozzarella cheese & desi herbs",
    "sizes": {
      "Small": 500,
      "Medium": 900,
      "Large": 1300,
      "XL": 1750
    },
    "badge": "Bestseller 🔥",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-veggi",
    "name": "Veggi Lover Pizza",
    "category": "Pizza",
    "description": "Fresh mushrooms, crispy onions, bell peppers, tomatoes, black olives & herb mozzarella",
    "sizes": {
      "Small": 600,
      "Medium": 1000,
      "Large": 1400,
      "XL": 2000
    },
    "badge": "Vegetarian 🌱",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-cheese-lover",
    "name": "Cheese Lover Pizza",
    "category": "Pizza",
    "description": "Triple blended pure mozzarella & cheddar cheese with rich aromatic marinara base",
    "sizes": {
      "Small": 600,
      "Medium": 1000,
      "Large": 1400,
      "XL": 2000
    },
    "badge": "Super Cheesy 🧀",
    "image": "assets/food/pizza_margherita.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-malai-boti",
    "name": "Malai Boti Pizza",
    "category": "Pizza",
    "description": "Creamy tender malai boti chicken chunks, mushrooms, special white cream sauce & mozzarella",
    "sizes": {
      "Small": 600,
      "Medium": 1000,
      "Large": 1400,
      "XL": 2000
    },
    "badge": "Creamy Special",
    "image": "assets/food/pizza_crown.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-crave-x-spec",
    "name": "Crave X Special Pizza",
    "category": "Pizza",
    "description": "Chef special combination chicken, sausages, smoked capsicum, olives & signature garlic sauce",
    "sizes": {
      "Small": 600,
      "Medium": 1000,
      "Large": 1400,
      "XL": 2000
    },
    "badge": "Signature ⭐",
    "image": "assets/food/pizza_crown.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-peri-peri",
    "name": "Peri Peri Pizza",
    "category": "Pizza",
    "description": "Spicy peri peri marinated chicken cubes, jalapenos, onions & spicy peri sauce swirl",
    "sizes": {
      "Small": 600,
      "Medium": 1000,
      "Large": 1400,
      "XL": 2000
    },
    "badge": "Hot & Spicy 🌶️",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-deep-dish",
    "name": "Deep Dish Pizza",
    "category": "Pizza",
    "description": "Thick golden buttery crust filled with mountain of cheese, rich tomato herb sauce & meat",
    "sizes": {
      "Medium": 1200,
      "Large": 1600,
      "XL": 2200
    },
    "badge": "Signature 👑",
    "image": "assets/food/pizza_deep_dish.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-special-steam",
    "name": "Special Steam Pizza",
    "category": "Pizza",
    "description": "Steamed chicken specialty, secret spices, crunchy vegetables & golden melted cheese",
    "sizes": {
      "Medium": 1300,
      "Large": 1900
    },
    "badge": "Chef Special",
    "image": "assets/food/pizza_deep_dish.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-cheese-stuffer",
    "name": "Cheese Stuffer Pizza",
    "category": "Pizza",
    "description": "Decadent cheese stuffed crust oozing mozzarella with spicy chicken toppings",
    "sizes": {
      "Medium": 1200,
      "Large": 1600,
      "XL": 2200
    },
    "badge": "Stuffed Crust",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-kebab-stuffer",
    "name": "Kebab Stuffer Pizza",
    "category": "Pizza",
    "description": "Handcrafted spiced kebab stuffed edges, smoky barbecue chicken & juicy toppings",
    "sizes": {
      "Medium": 1200,
      "Large": 1600,
      "XL": 2200
    },
    "badge": "Kebab Crust",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-chicken-cheese-stuffer",
    "name": "Chicken & Cheese Stuffer Pizza",
    "category": "Pizza",
    "description": "Double stuffed edges with seasoned chicken and cheddar mozzarella blend",
    "sizes": {
      "Medium": 1200,
      "Large": 1600,
      "XL": 2200
    },
    "badge": "Double Stuffed",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-star-bite",
    "name": "Star Bite Pizza",
    "category": "Pizza",
    "description": "Signature star-shaped bite crust stuffed with creamy cheese and chicken fillings",
    "sizes": {
      "Medium": 1300,
      "Large": 1750,
      "XL": 2250
    },
    "badge": "Star Special ⭐",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "pz-bihari-kebab",
    "name": "Bihari Kebab Pizza",
    "category": "Pizza",
    "description": "Aromatic Bihari spiced kebab chunks, caramelized onions, green chili sauce & mozzarella",
    "sizes": {
      "Medium": 1100,
      "Large": 1500,
      "XL": 2050
    },
    "badge": "Desi Taste",
    "image": "assets/food/pizza_tikka.jpg",
    "emoji": "🍕"
  },
  {
    "id": "bg-chapli",
    "name": "Chapli Burger",
    "category": "Burgers",
    "description": "Traditional Peshawari chapli patty, tomato, onions & mint sauce in toasted bun",
    "price": 300,
    "badge": "Desi Crave",
    "image": "assets/food/burger_patty.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-zinger",
    "name": "Zinger Burger",
    "category": "Burgers",
    "description": "Ultra crispy double-breaded chicken breast, fresh iceberg & spicy garlic mayonnaise",
    "price": 370,
    "badge": "Bestseller 🔥",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-filled",
    "name": "Filled Burger",
    "category": "Burgers",
    "description": "Delicious cheese-filled chicken patty with secret garlic mayo and lettuce",
    "price": 360,
    "badge": "Cheesy",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-chicken-patty",
    "name": "Chicken Patty Burger",
    "category": "Burgers",
    "description": "Classic golden fried chicken patty, crisp lettuce & signature dressing",
    "price": 300,
    "badge": "Classic",
    "image": "assets/food/burger_patty.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-max",
    "name": "Max Burger",
    "category": "Burgers",
    "description": "Loaded extra chicken patty, double slice cheese & smokey barbecue sauce",
    "price": 400,
    "badge": "Max Size",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-mighty-zinger",
    "name": "Mighty Zinger Burger",
    "category": "Burgers",
    "description": "Double crispy zinger chicken fillets, double cheddar cheese, lettuce & chili sauce",
    "price": 600,
    "badge": "Mighty Double 🔥",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-tower",
    "name": "Tower Burger",
    "category": "Burgers",
    "description": "Crispy chicken fillet stacked with golden hash brown patty, cheese slice & tangy sauce",
    "price": 650,
    "badge": "Tower Stack",
    "image": "assets/food/burger_monster.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-chicken-grill",
    "name": "Chicken Grill Burger",
    "category": "Burgers",
    "description": "Juicy marinated char-grilled chicken breast, grilled onions & herb peri glaze",
    "price": 600,
    "badge": "Grilled",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-pizza-burger",
    "name": "Pizza Burger",
    "category": "Burgers",
    "description": "Fusion burger with pizza sauce, melted mozzarella pull, pepperoni & crispy chicken",
    "price": 380,
    "badge": "Pizza Fusion 🍕",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-panda",
    "name": "Panda Burger",
    "category": "Burgers",
    "description": "Giant signature loaded burger with double patties, crunchy layers, egg & gourmet sauces",
    "price": 700,
    "badge": "Monster 🐼",
    "image": "assets/food/burger_patty.jpg",
    "emoji": "🍔"
  },
  {
    "id": "bg-crave-x-spec",
    "name": "Crave X Special Burger",
    "category": "Burgers",
    "description": "Special chef creation with crispy fillet, cheese crown, fresh veggies & crave dip",
    "price": 550,
    "badge": "Chef Special ⭐",
    "image": "assets/food/burger_zinger.jpg",
    "emoji": "🍔"
  },
  {
    "id": "wr-crave-x-spec",
    "name": "Crave X Special Wrap",
    "category": "Wraps & Shawarma",
    "description": "Tender grilled chicken strips, cheese slice, lettuce & CraveX signature sauce in tortilla",
    "price": 650,
    "badge": "Special Wrap",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "wr-crunchy",
    "name": "Special Crunchy Wrap",
    "category": "Wraps & Shawarma",
    "description": "Crunchy fried zinger chicken strips, jalapenos, cheese sauce & crisp veggies",
    "price": 580,
    "badge": "Crunchy 🌶️",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "wr-grilled-chicken",
    "name": "Grilled Chicken Wrap",
    "category": "Wraps & Shawarma",
    "description": "Smoky herb grilled chicken, lettuce, tomato & creamy garlic dip wrapped in warm flatbread",
    "price": 680,
    "badge": "Grilled",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sw-chicken",
    "name": "Chicken Shawarma",
    "category": "Wraps & Shawarma",
    "description": "Authentic Lebanese spiced shredded chicken, pickles & creamy garlic mayo in pita",
    "price": 200,
    "badge": "Classic",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sw-zinger",
    "name": "Zinger Shawarma",
    "category": "Wraps & Shawarma",
    "description": "Crispy fried zinger strips wrapped in soft pita with spicy chili garlic mayonnaise",
    "price": 330,
    "badge": "Spicy",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sw-zinger-pratha",
    "name": "Zinger Pratha Roll",
    "category": "Wraps & Shawarma",
    "description": "Crispy fried chicken strips rolled in flaky golden paratha with tangy green chutney",
    "price": 350,
    "badge": "Crispy Paratha",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sw-malai-pratha",
    "name": "Malai Boti Pratha Roll",
    "category": "Wraps & Shawarma",
    "description": "Charcoal grilled creamy malai boti chicken in hot crisp paratha with mint sauce",
    "price": 370,
    "badge": "Creamy Bestseller",
    "image": "assets/food/wrap_shawarma.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sr-crave-x-spec",
    "name": "Crave X Special Spin Roll",
    "category": "Spin Rolls",
    "description": "Signature rolled crust packed with cheese, seasoned chicken, jalapenos & herbs",
    "price": 550,
    "badge": "Signature Roll",
    "image": "assets/food/spin_roll.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sr-malai-boti",
    "name": "Malai Boti Roll",
    "category": "Spin Rolls",
    "description": "Creamy malai boti rolled in thin crispy dough with garlic herb dip",
    "price": 550,
    "badge": "Creamy",
    "image": "assets/food/spin_roll.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sr-bihari",
    "name": "Bihari Roll",
    "category": "Spin Rolls",
    "description": "Traditional Bihari tender spices with smoky aroma rolled to perfection",
    "price": 600,
    "badge": "Bihari Flavor",
    "image": "assets/food/spin_roll.jpg",
    "emoji": "🌯"
  },
  {
    "id": "sd-tikka",
    "name": "Tikka Sandwich",
    "category": "Sandwiches",
    "description": "Spiced chicken tikka cubes, mayo, egg slice & toasted sandwich bread",
    "price": 400,
    "badge": "Tikka Club",
    "image": "assets/food/sandwich_club.jpg",
    "emoji": "🥪"
  },
  {
    "id": "sd-cheese",
    "name": "Cheese Sandwich",
    "category": "Sandwiches",
    "description": "Golden toasted sandwich loaded with melted cheddar & mozzarella cheese herbs",
    "price": 400,
    "badge": "Cheesy",
    "image": "assets/food/sandwich_club.jpg",
    "emoji": "🥪"
  },
  {
    "id": "sd-special",
    "name": "Special Sandwich",
    "category": "Sandwiches",
    "description": "Double layer club sandwich with juicy chicken, fresh vegetables, cheese & egg",
    "price": 550,
    "badge": "Club Special",
    "image": "assets/food/sandwich_club.jpg",
    "emoji": "🥪"
  },
  {
    "id": "sd-lava",
    "name": "Lava Sandwich",
    "category": "Sandwiches",
    "description": "Explosion of melted hot liquid cheese lava over shredded BBQ chicken in pressed bread",
    "price": 650,
    "badge": "Cheese Lava 🧀",
    "image": "assets/food/sandwich_club.jpg",
    "emoji": "🥪"
  },
  {
    "id": "sd-malai-boti",
    "name": "Malai Boti Sandwich",
    "category": "Sandwiches",
    "description": "Creamy grilled malai chicken chunks in herb butter toasted sandwich bread",
    "price": 700,
    "badge": "Malai Special",
    "image": "assets/food/sandwich_club.jpg",
    "emoji": "🥪"
  },
  {
    "id": "sd-crave-x-spec",
    "name": "Crave X Special Sandwich",
    "category": "Sandwiches",
    "description": "Signature 3-layer monster sandwich loaded with chicken varieties, cheese & dips",
    "price": 700,
    "badge": "Supreme Club ⭐",
    "image": "assets/food/sandwich_club.jpg",
    "emoji": "🥪"
  },
  {
    "id": "ps-crave-x-spec",
    "name": "Crave X Special Pasta",
    "category": "Pasta",
    "description": "Oven baked penne pasta baked under thick layer of mozzarella cheese with chicken tikka",
    "price": 650,
    "badge": "Signature Pasta ⭐",
    "image": "assets/food/pasta_baked.jpg",
    "emoji": "🍝"
  },
  {
    "id": "ps-special",
    "name": "Special Pasta",
    "category": "Pasta",
    "description": "Creamy Alfredo style pasta tossed with grilled chicken, mushrooms & parmesan",
    "price": 600,
    "badge": "Creamy Alfredo",
    "image": "assets/food/pasta_baked.jpg",
    "emoji": "🍝"
  },
  {
    "id": "ps-lava",
    "name": "Lava Pasta",
    "category": "Pasta",
    "description": "Piping hot spicy pasta drenched in molten cheddar & mozzarella cheese lava",
    "price": 650,
    "badge": "Cheese Lava 🧀",
    "image": "assets/food/pasta_baked.jpg",
    "emoji": "🍝"
  },
  {
    "id": "ps-crunchy",
    "name": "Crunchy Pasta",
    "category": "Pasta",
    "description": "Baked pasta topped with crispy fried chicken chunks and crunch chips crumbs",
    "price": 700,
    "badge": "Crunchy Topping",
    "image": "assets/food/pasta_baked.jpg",
    "emoji": "🍝"
  },
  {
    "id": "ps-macaroni",
    "name": "Macaroni Pasta",
    "category": "Pasta",
    "description": "Delicious desi-style spicy macaroni with sauteed vegetables and seasoned chicken",
    "price": 550,
    "badge": "Classic Desi",
    "image": "assets/food/pasta_baked.jpg",
    "emoji": "🍝"
  },
  {
    "id": "st-popcorn",
    "name": "Pop Corn Chicken",
    "category": "Starters & Fries",
    "description": "Bite sized tender chicken breast coated in ultra crispy golden batter",
    "sizes": {
      "8 Pcs": 300,
      "16 Pcs": 580
    },
    "badge": "Crispy Bites",
    "image": "assets/food/sides_wings.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-hot-wings",
    "name": "Hot Wings",
    "category": "Starters & Fries",
    "description": "Crispy fried wings tossed in fiery red hot pepper sauce",
    "sizes": {
      "5 Pcs": 300,
      "10 Pcs": 580
    },
    "badge": "Spicy 🔥",
    "image": "assets/food/sides_wings.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-oven-baked-wings",
    "name": "Oven Baked Wings",
    "category": "Starters & Fries",
    "description": "Slow oven roasted glazed wings infused with aromatic Italian herbs",
    "sizes": {
      "5 Pcs": 330,
      "10 Pcs": 650
    },
    "badge": "Oven Baked",
    "image": "assets/food/sides_wings.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-peri-peri-wings",
    "name": "Peri Peri Wings",
    "category": "Starters & Fries",
    "description": "Wings glazed with tangy and spicy African peri-peri chili glaze",
    "sizes": {
      "5 Pcs": 330,
      "10 Pcs": 650
    },
    "badge": "Peri Peri 🌶️",
    "image": "assets/food/sides_wings.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-honey-wings",
    "name": "Honey Wings",
    "category": "Starters & Fries",
    "description": "Crispy golden wings tossed in sweet sticky honey garlic glaze",
    "sizes": {
      "5 Pcs": 330,
      "10 Pcs": 650
    },
    "badge": "Sweet & Savory",
    "image": "assets/food/sides_wings.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-bbq-wings",
    "name": "B.B.Q Wings",
    "category": "Starters & Fries",
    "description": "Char-grilled crispy wings smothered in hickory smoked BBQ sauce",
    "sizes": {
      "5 Pcs": 330,
      "10 Pcs": 650
    },
    "badge": "Smoky BBQ",
    "image": "assets/food/sides_wings.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-nuggets",
    "name": "Nuggets",
    "category": "Starters & Fries",
    "description": "Golden crumbed tender chicken nuggets served with garlic mayo dip",
    "sizes": {
      "5 Pcs": 320,
      "10 Pcs": 600
    },
    "badge": "Kids Choice",
    "image": "assets/food/nuggets_crispy.jpg",
    "emoji": "🍗"
  },
  {
    "id": "st-peri-peri-bites",
    "name": "Peri Peri Bites",
    "category": "Starters & Fries",
    "description": "Crispy cheese & jalapeno stuffed bites seasoned with spicy peri pepper",
    "sizes": {
      "5 Pcs": 330,
      "10 Pcs": 650
    },
    "badge": "Spicy Bites 🌶️",
    "image": "assets/food/nuggets_crispy.jpg",
    "emoji": "🧀"
  },
  {
    "id": "st-plain-fries",
    "name": "Plain Fries",
    "category": "Starters & Fries",
    "description": "Crispy golden salted French potato fries",
    "sizes": {
      "Regular": 250,
      "Large": 350
    },
    "badge": "Classic",
    "image": "assets/food/sides_fries.jpg",
    "emoji": "🍟"
  },
  {
    "id": "st-loaded-fries",
    "name": "Loaded Fries",
    "category": "Starters & Fries",
    "description": "Crispy fries covered in melted cheese sauce, seasoned chicken & jalapenos",
    "sizes": {
      "Regular": 400,
      "Large": 550
    },
    "badge": "Loaded 🔥",
    "image": "assets/food/sides_loaded_fries.jpg",
    "emoji": "🍟"
  },
  {
    "id": "st-garlic-mayo-fries",
    "name": "Garlic Mayo Fries",
    "category": "Starters & Fries",
    "description": "Crispy fries generously drizzled with signature garlic herb mayonnaise",
    "price": 550,
    "badge": "Saucy",
    "image": "assets/food/dip_sauces.jpg",
    "emoji": "🍟"
  },
  {
    "id": "st-masala-fries",
    "name": "Masala Fries",
    "category": "Starters & Fries",
    "description": "Hot crispy fries tossed with zesty desi chaat masala spice blend",
    "price": 350,
    "badge": "Spicy Desi",
    "image": "assets/food/sides_fries.jpg",
    "emoji": "🍟"
  },
  {
    "id": "dn-medium",
    "name": "Donner Medium",
    "category": "Donner",
    "description": "Authentic shaved spiced donner meat served with pita, salads & garlic sauce",
    "price": 1100,
    "badge": "Donner Meat",
    "image": "assets/food/donner_kebab.jpg",
    "emoji": "🥙"
  },
  {
    "id": "dn-large",
    "name": "Donner Large",
    "category": "Donner",
    "description": "Large portion authentic shaved donner meat, double pita, fresh salads & special sauces",
    "price": 1400,
    "badge": "Donner Feast",
    "image": "assets/food/donner_kebab.jpg",
    "emoji": "🥙"
  },
  {
    "id": "sc-chef",
    "name": "Chef Special Sauce",
    "category": "Dip Sauces",
    "description": "Chef signature creamy spiced gourmet dipping sauce",
    "price": 100,
    "badge": "Signature Dip",
    "image": "assets/food/dip_sauces.jpg",
    "emoji": "🥣"
  },
  {
    "id": "sc-garlic-mayo",
    "name": "Garlic Mayo Sauce",
    "category": "Dip Sauces",
    "description": "Rich creamy roasted garlic mayonnaise dip",
    "price": 80,
    "badge": "Creamy Dip",
    "image": "assets/food/dip_sauces.jpg",
    "emoji": "🥣"
  },
  {
    "id": "sc-malai-boti",
    "name": "Malai Boti Sauce",
    "category": "Dip Sauces",
    "description": "Special velvet malai white dip sauce",
    "price": 80,
    "badge": "Malai Dip",
    "image": "assets/food/dip_sauces.jpg",
    "emoji": "🥣"
  },
  {
    "id": "sc-peri-peri",
    "name": "Peri Peri Sauce",
    "category": "Dip Sauces",
    "description": "Spicy African bird's eye chili dipping sauce",
    "price": 80,
    "badge": "Hot Dip 🌶️",
    "image": "assets/food/dip_sauces.jpg",
    "emoji": "🥣"
  },
  {
    "id": "dr-can",
    "name": "Soft Drink (Tin Pack / Can 345ml)",
    "category": "Beverages",
    "description": "Ice chilled Pepsi, 7Up, Mirinda, Coke, or Sprite (345ml)",
    "price": 120,
    "badge": "Chilled",
    "image": "assets/food/drink_can.jpg",
    "emoji": "🥤"
  },
  {
    "id": "dr-1l",
    "name": "Soft Drink (1 Litre Bottle)",
    "category": "Beverages",
    "description": "Chilled 1.0L carbonated soft drink bottle",
    "price": 180,
    "badge": "Chilled",
    "image": "assets/food/drink_bottle.jpg",
    "emoji": "🍾"
  },
  {
    "id": "dr-15l",
    "name": "Soft Drink (1.5 Litre Bottle)",
    "category": "Beverages",
    "description": "Chilled family size 1.5L carbonated beverage bottle",
    "price": 250,
    "badge": "Family",
    "image": "assets/food/drink_bottle.jpg",
    "emoji": "🍾"
  },
  {
    "id": "dr-shake-choco",
    "name": "Belgian Thick Chocolate Shake",
    "category": "Beverages",
    "description": "Rich Belgian chocolate gelato blended with creamy whole milk & chocolate syrup",
    "price": 450,
    "badge": "Thick & Sweet",
    "image": "assets/food/drink_choco_shake.jpg",
    "emoji": "🥤"
  },
  {
    "id": "dr-shake-oreo",
    "name": "Oreo Crunch Frappe Shake",
    "category": "Beverages",
    "description": "Crushed Oreo cookies blended with vanilla bean cream, whipped cream & fudge",
    "price": 480,
    "badge": "Favorite",
    "image": "assets/food/drink_oreo_shake.jpg",
    "emoji": "🥤"
  },
  {
    "id": "dr-mint",
    "name": "Fresh Mint Lemonade",
    "category": "Beverages",
    "description": "Refreshing crushed mint leaves, fresh lemon juice, sparkling soda & rock salt",
    "price": 280,
    "badge": "Refreshing",
    "image": "assets/food/drink_mint.jpg",
    "emoji": "🍋"
  },
  {
    "id": "dr-water",
    "name": "Mineral Water",
    "category": "Beverages",
    "description": "Pure chilled mineral drinking water",
    "price": 60,
    "badge": "Chilled",
    "image": "assets/food/drink_can.jpg",
    "emoji": "💧"
  }
];
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = menu;
  }
  if (typeof root !== 'undefined') {
    root.CRAVE_OFFICIAL_MENU = menu;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);

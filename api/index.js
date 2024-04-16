const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

/*
searchFoods
-- Searches through third-party API

Currenyl extracts first 20 results and checks that user is signed in
Returned data looks like:
[{
  foodContentsLabel: null,
  foodId: "food_a299wq8bece4vtb3ku5edb5gnjhc",
  image: "https://www.edamam.com/food-img/f7b/f7be68b0bf0b29937281c1cf8758e4e5.jpg",
  label: "Pork Shoulder"
}, ...]
NOTE: if no results, extractedData will be an empty object
*/
app.http('searchFoods', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'search/food',
  handler: async (request, context) => {
      const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL')
      let authToken = null
      if (auth_header) {
          authToken = Buffer.from(auth_header, "base64");
          authToken = JSON.parse(authToken.toString()).userId;
          context.log("AUTH TOKEN: ", authToken);
      }
      else{
          return {
              status: 401,
              body: "Authorization token is missing."
          }; 
      }
      let data = null;
      const body = await request.json();
      const food = body.food;
      const appId = process.env.EDAMAME_FOOD_SEARCH_APP_ID;
      const appKey = process.env.EDAMAME_FOOD_SEARCH_APP_KEY;
      context.log("Food: ", food);
      context.log("appID: ", appId);
      context.log("appKey: ", appKey);

      const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&ingr=${encodeURIComponent(food)}&app_key=${appKey}`;
      context.log("URL: ", url);
      const response = await fetch(url);

      if (!response.ok) {
        return {
          jsonBody: {error: await response.text()}
        }
      }

      const foodRes = await response.json();
      context.log("FoodRes: ", foodRes);
      const foods = foodRes.hints.slice(0, 20);  // get first 20 results
      const extractedData = foods.map(item => {
        if (!item.food.foodContentsLabel) item.food.foodContentsLabel = null
        return item.food
    });
    context.log("Extracted data: ", extractedData);
    return {
        jsonBody: {data: extractedData}
    }
  },
});


/*
searchRecipes
-- Searches through third-party API
*/
// app.http('searchRecipes', {
//   methods: ['GET'],
//   authLevel: 'anonymous',
//   route: 'search/recipe/{q}',
//   handler: async (request, context) => {
//       const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL')
//       let authToken = null
//       if (auth_header) {
//           authToken = Buffer.from(auth_header, "base64");
//           authToken = JSON.parse(authToken.toString()).userId;
//           console.log("AUTH TOKEN: ", authToken);
//       }
//       else{
//           return {
//               status: 401,
//               body: "Authorization token is missing."
//           }; 
//       }
//       let data = null;
//       const q = request.params.q;
//       console.log("Query: ", q);
//       const response = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&app_id=${{process.env.EDAMAME_FOOD_SEARCH_APP_ID}}&app_key=${{process.env.EDAMAME_FOOD_SEARCH_APP_KEY}}&q=${encodeURIComponent(q)}`);
//       const foodRes = await response.json();
//       const foods = foodRes.parsed.slice(0, 20);
//       const extractedData = foods.map(item => {
//         const { foodId, label, image, foodContentsLabel } = item.food;
//         data =  {
//             foodId,
//             label,
//             image,
//             foodContentsLabel: foodContentsLabel || null // Set to null if not present
//         };
//     });    
//     console.log(extractedData);
//     return {
//         jsonBody: {data: extractedData}
//     }
//   },
// });


// FUNCTION NAME: getUserFoods
// DESCRIPTION: gets foods currently in user's virtual pantry
// RETURN: status and jsonBody of JSON food objects (or an error message)
app.http('getUserFoods', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'foods',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const name = token.userDetails;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const userInfo = await client.db("LetMeCookDB").collection("users").findOne({name: name, userId: userId});
      const userFoods = userInfo.foods;
      client.close();
      return {
        status: 201,
        jsonBody: {foods: userFoods}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Authorization failed for retrieving user's foods"}
    }
  },
});


// ***TODO***
// FUNCTION NAME: getFood
// DESCRIPTION: get's the specific food item using a unique ObjectId
// RETURN: status and jsonBody of the food's details, or an error message
app.http('getFood', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'food/{id}',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const name = token.userDetails;
      const _id = request.params.id;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const food = await client.db("LetMeCookDB").collection("users").findOne({food :{$elemMatch: {_id: _id}}});
      // const userInfo = await client.db("LetMeCookDB").collection("users").find({_id: _id});
      if (food) {
        return {
          status: 201,
          jsonBody: {food: food}
        }
      } else {
        return {
          status: 404,
          jsonBody: {error: "Could not find food with id: " + _id}
        }
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Authorization failed for obtaining food information"}
    }
  },
});


// ***TODO***
// FUNCTION NAME: insertFoodForUser
// DESCRIPTION: Places food item into the user's virtual pantry
// RETURN: status and jsonBody with inserted food details, or an error
app.http("insertFoodForUser", {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'food',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const name = token.userDetails;
      const body = await request.json();
      const foodName = body.foodName;
      const quantity = body.quantity;
      const expirationDate = body.expirationDate;
      const payload = {foodName, quantity, expirationDate};
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const result = await client.db("LetMeCookDB").collection("users").insertOne({name: name, userId: userId}, {$push: {foods: payload}});
      return {
        status: 201,
        jsonBody: {food: payload}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Authorization failed for entering food into user's pantry"}
    }
  },
});

// FUNCTION NAME: getUserRecipes
// DESCRIPTION: gets recipes the user has previously cooked
// RETURN: status and jsonBody with array of recipes, or an error message
app.http('getUserRecipes', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'recipes',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const name = token.userDetails;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const userInfo = await client.db("LetMeCookDB").collection("users").findOne({name: name, userId: userId});
      const recipes = userInfo.recipes;
      client.close();
      return {
        status: 201,
        jsonBody: {recipes: recipes}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Authorization failed for retrieving user recipes"}
    }
  },
});


// FUNCTION NAME: saveRecipeForUser
// DESCRIPTION: saves a recipe for the user's 'account'
// RETURN: status and jsonBody with the recipe's details, or an error message
app.http('saveRecipeForUser', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'recipes/{id}',
  handler: async (request, context) => {
    const _id = request.params.id;
    if (ObjectId.isValid(_id)) {
      const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
      let token = null;
      if (auth_header) {
        token = Buffer.from(auth_header, "base64");
        token = JSON.parse(token.toString());
        context.log("token= " + JSON.stringify(token));
        const userId = token.userId;
        const name = token.userDetails;
        const client = mongoClient.connect(process.env.AZURE_MONGO_DB);
        const recipe = await client.db("LetMeCookDB").collection("recipes").findOne({_id: _id});
        const result = await client.db("LetMeCookDB").collection("users").updateOne({name: name, userId: userId}, 
          {$push: { recipes: { _id: recipe._id}}});
        client.close();
        return {
          status: 201,
          jsonBody: {recipe: recipe}
        }
      }
      return {
        status: 404,
        jsonBody: {error: "Authorization failed for saving recipe"}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Object id for recipe failed validation"}
    }
  },
});


// FUNCTION NAME: saveRecipeForAll
// DESCRIPTION: saves a recipe to the DB for all users to access
// RETURN: status and jsonBody with the _id of the newly inserted recipe & its details, or an error message
app.http('saveRecipeForAll', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: '',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const name = token.userDetails;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const body = await request.json();
      const recipe = body.recipe;
      const payload = { recipe };
      const result = await client.db("LetMeCookDB").collections("recipes").insertOne(payload);
      client.close();
      return {
        status: 201,
        jsonBody: {_id: result.insertedId, recipe: recipe}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Authorization failed for saving recipe to DB"}
    }
  },
});


// FUNCTION NAME: checkUser
// DESCRIPTION: create a new user's 'account' for foods and recipes
// RETURN: status and jsonBody of the new 'account' _id, empty foods array, and empty recipes array, OR an error message
app.http('checkUser', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'login',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const name = token.userDetails;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      let res = await client.db("LetMeCookDB").collection("users").findOne({name: name, userId: userId});
      if (!res) {
        const foods = [];
        const recipes = [];
        const payload = { name, userId, foods, recipes };
        res = await client.db("LetMeCookDB").collection("users").insertOne(payload);
      }
      client.close();
      return {
        status: 201,
        jsonBody: {_id: res.insertedId}
      }
    }
  },
});

// ***TODO***
// FUNCTION NAME: getExpiringFoods
// DESCRIPTION: get list of foods expiring soon
// RETURN:

// ***TODO***
// FUNCTION NAME: getLowQuantityFoods
// DESCRIPTION: get list of foods low in quantity
// RETURN: 


app.http('searchRecipesFromIngredients', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'search/recipes/{ingredients}',
    handler: async (request, context) => {
    // EXPECTING: ingredients in comma-separated string
      const ingredients = request.params.ingredients;
      const ingredientsStr = encodeURIComponent(ingredients);
      const resNumber = 3;
      const apiKey = process.env.SPOONACULAR_API_KEY; 
      const queryURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsStr}&number=${resNumber}&apiKey=${apiKey}`;
      const response = await fetch(queryURL);
      const data = await response.json();
      
      // Returning the response
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    },
  });


// GET https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
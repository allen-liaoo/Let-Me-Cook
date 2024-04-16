const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

// searchFoods
// -- Searches through third-party API

// searchRecipes
// -- Searches through third-party API



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
    _id = request.params.id;
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


// FUNCTION NAME: createUserPantry
// DESCRIPTION: create a new user's 'account' for foods and recipes
// RETURN: status and jsonBody of the new 'account' _id, empty foods array, and empty recipes array, OR an error message
app.http('createUserPantry', {
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
      const foods = [];
      const recipes = [];
      const payload = { name, userId, foods, recipes };
      const result = await client.db("LetMeCookDB").collection("users").insertOne(payload);
      client.close();
      return {
        status: 201,
        jsonBody: {_id: result.insertedId, foods: foods, recipes: recipes}
      }
    }
  },
});


app.http('searchRecipes', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'searchRecipes/{ingredients}',
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
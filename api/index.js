const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

// Yummy yummy in my tummy
app.http('getUserFoods', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'foods/{_id}',
  handler: async (request, context) => {
    const _id = request.params._id;
    const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
    const userInfo = await client.db("LetMeCookDB").collection("users").find({_id:_id})
    const userFoods = userInfo.foods;
    client.close();
    return {
      jsonBody: {foods: userFoods}
    }
  },
});

app.http('getFood', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'food/{id}',
  handler: async (request, context) => {
    const _id = request.params.id;
    const body = await request.json();
    const userId = body.userId;
    const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
    const userInfo = await client.db("LetMeCookDB").collection("users").find({_id: _id})
  },
});

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
      const userInfo = await client.db("LetMeCookDB").collection("users").find({name: name, userId: userId});
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
        const recipe = await client.db("LetMeCookDB").collection("recipes").find({_id: _id});
        const user = await client.db("LetMeCookDB").collection("users").find({userId: userId, name: name});
        const prevRecipes = user.recipes;
        const recipes = [...prevRecipes, recipe];
        const result = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId, name: name}, {$set: {recipes}});
        client.close();
        return {
          status: 201,
          jsonBody: {recipes: recipes}
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

app.http('saveRecipeForAll', {
  methods: ['POST'],
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

app.http('createUserPantry', {
  methods: ['POST'],
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
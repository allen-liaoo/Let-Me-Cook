const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;

// connect-with-default-azure-credential.js
// Azure Storage dependency
const { StorageSharedKeyCredential, BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require('@azure/identity');
// require('dotenv').config()

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
if (!accountKey) throw Error("Azure Storage accountKey not found");

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

const baseUrl = `https://${accountName}.blob.core.windows.net`;
// const containerName = `my-container`;

// Create BlobServiceClient
const blobServiceClient = new BlobServiceClient(
  `${baseUrl}`,
  sharedKeyCredential
);

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
      const extractedData = foods.map(item => ({
        apiId: item.food.foodId,
        name: item.food.label,
        image: item.food.image
    }));
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
app.http('searchRecipes', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'search/recipe',
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
      const body = await request.json();
      const q = body.recipe;
      const appId = process.env.EDAMAME_RECIPE_SEARCH_APP_ID;
      const appKey = process.env.EDAMAME_RECIPE_SEARCH_APP_KEY;
      const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}&q=${encodeURIComponent(q)}`;
      context.log("Query: ", q);

      const response = await fetch(url);
      if (!response.ok) {
        return {
          jsonBody: {error: await response.text()}
        }
      }

      const recipeRes = await response.json();
      const recipes = recipeRes.hits.slice(0, 20);
      context.log("First 20 unfiltered results: ", recipes);
      const extractedData = recipes.map(r => {
        // URI looks like: 
        // https://www.edamam.com/ontologies/edamam.owl#recipe_7a4555745d484bec92c26b26d7d74cd3
        // apiId starts after the last "_"
        const ind = r.recipe.uri.lastIndexOf('_') + 1
        return { 
        apiId: r.recipe.uri.slice(ind),
        name: r.recipe.label,
        image: r.recipe.image,
      }
    })

    context.log(extractedData);
    return {
        jsonBody: {data: extractedData}
    }
  },
});


// FUNCTION NAME: getFoods
// DESCRIPTION: gets foods currently in user's virtual pantry
// RETURN: status and jsonBody of JSON food objects (or an error message)
app.http('getFoods', {
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
      const foods = await client.db("LetMeCookDB").collection("foods").find({userId: userId}).project({name: 1, quantity: 1, image: 1, expirationDate: 1}).toArray();
      // const userInfo = await client.db("LetMeCookDB").collection("users").findOne({name: name, userId: userId});
      // const foods = userInfo.foods;
      client.close();
      return {
        status: 201,
        jsonBody: {foods: foods}
      }
    }
    return {
      status: 403,
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
    if (auth_header) {
      const _id = request.params.id;
      context.log("_id= " + _id);
      if (ObjectId.isValid(_id)) {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        // const food = await client.db("LetMeCookDB").collection("foods").findOne({_id: _id});
        const food = await client.db("LetMeCookDB").collection("foods").findOne({_id: new ObjectId(_id)});
        
        context.log("food= " + JSON.stringify(food));
        client.close();
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
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for obtaining food information"}
    }
  },
});


app.http("getRecipe", {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'recipe/{id}',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const _id = request.params.id;
      if (ObjectId.isValid(_id)) {
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const recipe = await client.db("LetMeCookDB").collection("recipes").findOne({_id: new ObjectId(_id)});
        return {
          status: 201,
          jsonBody: {recipe: recipe}
        }
      }
      return {
        status: 404,
        jsonBody: {error: "Failed to retrieve recipe with id: " + _id}
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for retrieving recipe"}
    }
  },
});


// FUNCTION NAME: getRecipes
// DESCRIPTION: retrieves user's recipes
// RETURN: status and jsonBody with list of recipes, or an error
app.http("getRecipes", {
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
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const recipes = await client.db("LetMeCookDB").collection("recipes").find({userId: userId}).toArray();
      client.close();
      return {
        status: 201,
        jsonBody: {recipes: recipes}
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for retrieving user's recipes"}
    }
  },
});



// ***TODO***
// FUNCTION NAME: insertFood
// DESCRIPTION: Places food item into the user's virtual pantry
// RETURN: status and jsonBody with inserted food details, or an error
app.http("insertFood", {
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
      const userName = token.userDetails;
      const body = await request.json();
      const name = body.name;
      const image = body.image;
      const apiId = body.apiId;
      const quantity = null;
      const expirationDate = null;
      const payload = {userId, apiId, name, image, quantity, expirationDate};
      context.log("payload= " + JSON.stringify(payload));
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const result = await client.db("LetMeCookDB").collection("foods").insertOne(payload);
      console.log("result= " + JSON.stringify(result));
      // db.companies.updateOne({ "_id": "123" },
      // { $push: { "company.employees": { "firstname": "Maxime", "surname": "Beugnet", "role": "Senior Developer Advocate" } } })
      await client.db("LetMeCookDB").collection("users").updateOne({name: userName, userId: userId}, {$push: {foods: {_id: result.insertedId}}});
      const userInfo = await client.db("LetMeCookDB").collection("users").findOne({name: userName, userId: userId})
      context.log("userInfo: " + JSON.stringify(userInfo))
      client.close();
      return {
        status: 201,
        jsonBody: {_id: result.insertedId}
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for entering food into user's pantry"}
    }
  },
});

// FUNCTION NAME: getUserRecipes
// DESCRIPTION: gets recipes the user has previously cooked
// RETURN: status and jsonBody with array of recipes, or an error message
// app.http('getUserRecipes', {
//   methods: ['GET'],
//   authLevel: 'anonymous',
//   route: 'recipes',
//   handler: async (request, context) => {
//     const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
//     let token = null;
//     if (auth_header) {
//       token = Buffer.from(auth_header, "base64");
//       token = JSON.parse(token.toString());
//       context.log("token= " + JSON.stringify(token));
//       const userId = token.userId;
//       const name = token.userDetails;
//       const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
//       const userInfo = await client.db("LetMeCookDB").collection("users").findOne({name: name, userId: userId});
//       const recipes = userInfo.recipes;
//       client.close();
//       return {
//         status: 201,
//         jsonBody: {recipes: recipes}
//       }
//     }
//     return {
//       status: 403,
//       jsonBody: {error: "Authorization failed for retrieving user recipes"}
//     }
//   },
// });


// FUNCTION NAME: insertRecipe
// DESCRIPTION: saves a recipe for the user's 'account'
// RETURN: status and jsonBody with the recipe's details, or an error message
app.http('insertRecipe', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'recipe',
  handler: async (request, context) => {
    // const _id = request.params.id;
    // if (ObjectId.isValid(_id)) {
      const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
      let token = null;
      if (auth_header) {
        token = Buffer.from(auth_header, "base64");
        token = JSON.parse(token.toString());
        context.log("token= " + JSON.stringify(token));
        const userId = token.userId;
        // const userName = token.userDetails;

        // Setup API call
        const body = await request.json();
        const apiId = body.apiId;
        const appId = process.env.EDAMAME_RECIPE_SEARCH_APP_ID;
        const appKey = process.env.EDAMAME_RECIPE_SEARCH_APP_KEY;
        const url = `https://api.edamam.com/api/recipes/v2/${apiId}?type=public&app_id=${appId}&app_key=${appKey}`;
        context.log("apiId for recipe: ", apiId);
  
        // Make API call
        const response = await fetch(url);
        if (!response.ok) {
          return {
            jsonBody: {error: await response.text()}
          }
        }
  
        // Extract data from response
        const r = await response.json();
        const instructions = r.recipe.instructions ? r.recipe.instructions : r.recipe.url;
        const ingredients = r.recipe.ingredients.map(e => ({
          apiId: e.foodId,
          name: e.food,
          amount: e.quantity,
          unit: e.measure,
          text: e.text,
        }));
        const image = body.image;

        const name = body.name;
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const payload = {name, userId, apiId, ingredients, instructions, image};
        const recipeResult = await client.db("LetMeCookDB").collection("recipes").insertOne(payload);
        const userResult = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId}, {$push: {recipes: {_id: recipeResult.insertedId}}});
        // const result = await client.db("LetMeCookDB").collection("users").updateOne({name: name, userId: userId}, 
          // {$push: { recipes: { _id: recipe._id}}});
        client.close();
        return {
          status: 201,
          jsonBody: {_id: recipeResult.insertedId}
        }
      }
      return {
        status: 403,
        jsonBody: {error: "Authorization failed for saving recipe"}
      }
    // }
    // return {
    //   status: 404,
    //   jsonBody: {error: "Object id for recipe failed validation"}
    // }
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
        client.close();
        context.log("user was created!");
        return {
          status: 201,
          jsonBody: {_id: res.insertedId, message: "user was created!"}
        }
      } else {
        client.close();
        context.log("user was found!");
        return {
          status: 201,
          jsonBody: {_id: res.insertedId, message: "user was found!"}
        }
      }
    }
  },
});


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


app.http('editFood', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'food/edit/{id}',
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
        const body = await request.json();
        if (body) {
          const name = body.name;
          const image = body.image;
          const quantity = ((body.quantity >= 0) ? body.quantity : 0);
          const expirationDate = body.expirationDate;
          const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
          let result;
          if (image) {
            // const containerName = 'food-container';
            // const blobName = 'food-pics';
            // const fileName = _id + '.txt';
            // const filePath = baseUrl + '/' + containerName + '/' + blobName + '/' + fileName;

            // // // create container client
            // const containerClient = await blobServiceClient.getContainerClient(containerName);

            // // // create blob client
            // const blobClient = await containerClient.getBlockBlobClient(blobName);

            // // // download file
            // await blobClient.downloadToFile(fileName);
            result = await client.db("LetMeCookDB").collection("foods")
                .updateOne({_id: new ObjectId(_id), userId: userId}, 
                  {$set: {name: name, image: image, quantity: quantity, expirationDate: expirationDate}});
                    // {$set: {name: name, image: filePath, quantity: quantity, expirationDate: expirationDate}});
          }
          else {
            result = await client.db("LetMeCookDB").collection("foods")
                .updateOne({_id: new ObjectId(_id), userId: userId}, 
                    {$set: {name: name, quantity: quantity, expirationDate: expirationDate}});
          }
          client.close();
          if (result.matchedCount > 0) {
            return {
              status: 201,
              jsonBody: {_id: _id}
            }
          }
          return {
            status: 403,
            jsonBody: {error: "Authorization failed for editing food with id: " + _id}
          }
        }
        return {
          status: 405,
          jsonBody: {error: "Empty content sent to edit food with id: " + _id}
        }
      }
      return {
        status: 403,
        jsonBody: {error: "Authorization failed for editing food with id: " + _id}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Unknown food with id: " + _id}
    }
  },
});

app.http('editRecipe', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'recipe/edit/{id}',
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
        const body = await request.json();
        const name = body.name;
        const image = body.image;
        const instructions = body.instructions;
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const result = await client.db("LetMeCookDB").collection("recipes").updateOne({_id: new ObjectId(_id), userId: userId}, {$set: {name: name, image: image, instructions: instructions}});
        client.close();
        if (result.matchedCount > 0) {
          return {
            status: 201,
            jsonBody: {_id: _id}
          }
        }
        return {
          status: 403,
          jsonBody: {error: "Authorization failed for editing recipe with id: " + _id}
        }
      }
      return {
        status: 403,
        jsonBody: {error: "Authorization failed for editing recipe with id: " + _id}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Unknown recipe with id: " + _id}
    }
  },
});

app.http('removeFood', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'food/delete/{id}',
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
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const resultOne = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId}, {$pull : {foods: {_id: new ObjectId(_id)}}});
        const resultTwo = await client.db("LetMeCookDB").collection("foods").deleteOne({_id: new ObjectId(_id), userId: userId}, function(err, obj) {
          if (err) {
            context.log("ERROR OCCURRED: " + err);
          }
        });
        client.close();
        if (resultOne && resultTwo) {
          return {
            status: 204
          }
        }
        return {
          status: 400,
          jsonBody: {error: "Failed to delete food with id: " + _id}
        }
      }
      return {
        status: 403,
        jsonBody: {error: "Authorization failed for removing food with id: " + _id}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Unknown food with id: " + _id}
    }
  },
});

app.http('removeRecipe', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'recipe/delete/{id}',
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
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const resultOne = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId}, {$pull : {recipes: {_id: new ObjectId(_id)}}});
        const resultTwo = await client.db("LetMeCookDB").collection("recipes").deleteOne({_id: new ObjectId(_id), userId: userId}, function(err, obj) {
          if (err) {
            context.log("ERROR OCCURRED: " + err);
          }
        });
        client.close();
        if (resultOne && resultTwo) {
          return {
            status: 204
          }
        }
        return {
          status: 400,
          jsonBody: {error: "Failed to delete recipe with id: " + _id}
        }
      }
      return {
        status: 403,
        jsonBody: {error: "Authorization failed for removing recipe with id: " + _id}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Unknown recipe with id: " + _id}
    }
  },
});


app.http('addRecipeToQueue', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'recipe/queue/add/{id}',
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
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const result = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId}, {$push : {recipeQueue: {_id: new ObjectId(_id)}}});
        client.close();
        if (result.matchedCount > 0) {
          return {
            status: 201,
            jsonBody: {_id: _id}
          }
        }
        return {
          status: 500,
          jsonBody: {error: "Unable to insert recipe with id: " + _id + " to user's queue"}
        }
      }
      return {
        status: 403,
        jsonBody: {error: "Authorization failed for adding to queue with recipe id: " + _id}
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Unknown recipe with id: " + _id}
    }   
  },
});

app.http('removeRecipeFromQueue', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'recipe/queue/remove/{id}',
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
        const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
        const result = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId}, {$pull: {queue: {_id: _id}}});
        client.close();
        if (result.matchedCount === 0) {
          return {
            status: 204
          }
        }
      }
    }
    return {
      status: 404,
      jsonBody: {error: "Unknown recipe with id: " + _id}
    }   
  },
});

app.http('updateRecipeQueue', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'recipe/queue',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const body = await request.json();
      const recipes = body.recipes;
      const result = await client.db("LetMeCookDB").collection("users").updateOne({userId: userId}, {$set: {recipeQueue: recipes}});
      client.close();
      return {
        status: 201,
        jsonBody: {recipes: recipes}
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for updating recipe queue"}
    }
  },
});

// TODO: API for retrieving user's foods in order of soonest expiring dates
app.http('expiringFoods', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'foods/expiring',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      // const userInfo = await client.db("LetMeCookDB").collection("users").findOne({userId: userId});
      const foods = await client.db("LetMeCookDB").collection("foods").find({userId: userId}).toArray();
      client.close();
      if (foods) {
        let expiringFoods = foods;
        expiringFoods.sort((a, b) => a.expirationDate - b.expirationDate);
        return {
          status: 201,
          jsonBody: {expiringFoods: expiringFoods}
        }
      }
      return {
        status: 404,
        jsonBody: {error: "Unknown user with id: " + userId}
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for fetching expiring food info"}
    }
  },
});

// TODO: API for retrieving user's foods in order of least amounts
app.http('lowestFoods', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'foods/lowest',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      // const userInfo = await client.db("LetMeCookDB").collection("users").findOne({userId: userId});
      const foods = await client.db("LetMeCookDB").collection("foods").find({userId: userId}).toArray();
      client.close();
      if (foods) {
        let lowestQuantityFoods = foods;
        lowestQuantityFoods.sort((a, b) => a.quantity - b.quantity);
        return {
          status: 201,
          jsonBody: {lowestQuantityFoods: lowestQuantityFoods}
        }
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for fetching lowest quantity food info"}
    }
  },
});

app.http('searchUserRecipes', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'search/user/recipes',
  handler: async (request, context) => {
    const auth_header = request.headers.get('X-MS-CLIENT-PRINCIPAL');
    let token = null;
    if (auth_header) {
      token = Buffer.from(auth_header, "base64");
      token = JSON.parse(token.toString());
      context.log("token= " + JSON.stringify(token));
      const userId = token.userId;
      const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
      const body = await request.json();
      const searchTerm = body.search;
      if (searchTerm) {
        const recipes = await client.db("LetMeCookDB").collection("recipes").find({userId : userId}, {$elemMatch: {ingredients : {name : /.*searchTerm.*/}}}).toArray();
        client.close();
        if (recipes) {
          return {
            status: 201,
            jsonBody: {recipes: recipes}
          }
        }
        return {
          status: 201,
          jsonBody: {recipes: []}
        }
      }
      return {
        status: 201,
        jsonBody: {recipes: []}
      }
    }
    return {
      status: 403,
      jsonBody: {error: "Authorization failed for searching user's recipes"}
    }
  },
});

// GET https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
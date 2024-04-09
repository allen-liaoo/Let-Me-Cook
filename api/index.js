const { app } = require('@azure/functions');
const { ObjectId } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;



// Yummy yummy in my tummy
app.http('getUserFoods', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'foods/{userId}',
  handler: async (request, context) => {
    const userId = request.params.userId;
    const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
    const userInfo = await client.db("LetMeCookDB").collection("users").find({_id:userId}).toArray();
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
    const id = request.params.id;
    const client = await mongoClient.connect(process.env.AZURE_MONGO_DB);
    const food = await client.db("LetMeCookDB").collection("users").find({})
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
  


// app.http('updateDeck', {
//   methods: ['PUT'],
//   authLevel: 'anonymous',
//   route: 'deck/{id}',
//   handler: async (request, context) => {
//       const id = request.params.id;

//       const body = await request.json();
//       // skipping validation -- but I can at least do some basic defaulting, and only grab the things I want.
//       const name = body.name ?? "no name"
//       const cards = body.cards ?? []
      
//       if (ObjectId.isValid(id)) {
//           const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)
//           // this could not possibly be the fast way to do things.
//           const result = await client.db("flashcards").collection("decks").updateOne({_id: new ObjectId(id)}, {$set: {name, cards}})
//           client.close();
//           if (result.matchedCount > 0) {
//               return {
//                   jsonBody: {status: "ok"}
//               }
//           }            
//       }
//       return {
//           status:404,
//           jsonBody: {error: "no deck found by that Id"}
//       }
//   },
// });

// app.http('newDeck', {
//   methods: ['POST'],
//   authLevel: 'anonymous',
//   route: 'deck',
//   handler: async (request, context) => {
//       const client = await mongoClient.connect(process.env.AZURE_MONGO_DB)

//       const body = await request.json();
//       // skipping validation -- but I can at least do some basic defaulting, and only grab the things I want.
//       const name = body.name ?? "name"
//       const cards = body.cards ?? []
//       const payload = { name, cards }
//       const result = await client.db("flashcards").collection("decks").insertOne(payload)

//       client.close();
//       return{
//           status: 201, /* Defaults to 200 */
//           jsonBody: {_id: result.insertedId, name, cards:cards}
//       };
//   },
// });


GET https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar&number=2
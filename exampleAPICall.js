const ingredientsList = ['apples', 'flour', 'sugar'];

// Convert the array of ingredients into a string
const ingredientsStr = ingredientsList.join(',');


// async function callAPI({params, request}) {
//     const authToken = 'userHash1'; // User's login token
//     const apiUrl = 'searchRecipes/?ingredients=apples,+flour,+sugar&number=2'; 
//     const headers = {
//         'Authorization': authToken,
//         'x-api-key': process.env.SPOONACULAR_API_KEY  // If doing a request to spoonacular
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             headers: headers
//         });
//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }
//         const data = await response.json();
//         console.log(data);
//         return { todoItems: data.data }; 
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return { error: 'Failed to fetch data' };
//     }
// }
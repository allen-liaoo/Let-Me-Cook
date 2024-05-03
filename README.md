# Module 2 Group Assignment

CSCI 5117, Spring 2024, [assignment description](https://canvas.umn.edu/courses/413159/pages/project-2)

## App Info:

* Team Name: The Flask Fusion Force
* App Name: Let Me Cook
* App Link: <https://kind-tree-0e95d6c0f.5.azurestaticapps.net>

### Students

* Conner DeJong, dejon113@umn.edu
* Kris Moe, moe00013@umn.edu
* Allen Liao, liao0144@umn.edu
* Thomas Knickerbocker, knick073@umn.edu
* Owen Ratgen, ratge006@umn.edu


## Key Features

**Describe the most challenging features you implemented
(one sentence per bullet, maximum 4 bullets):**

* Allowing users to modify images for individual foods and recipes based on file or camera input
* A dragging mechanism on the recipes queue page to allow users to re-order the recipes to see more relevant ones on top

Which (if any) device integration(s) does your app support?

* Camera support (to replace images of foods in their "pantry" and recipes they have or will cook)

Which (if any) progressive web app feature(s) does your app support?

* N/A



## Mockup images

**[Link to our Canva Mockup](https://www.canva.com/design/DAGAcky4OlU/zWBVUIILFJjYH-Ltm1b3uw/edit?utm_content=DAGAcky4OlU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) HIGHLY RECOMMEND LOOKING AT THIS FOR CLARIFYING NAVIGATION BETWEEN PAGES**

**![Landing Page](/MOCKUP/LMC_landing_page.png?raw=true)Where users are brought to upon loading the homepage.**
**![Ingredients Page](/MOCKUP/LMC_ingredients_page.png?raw=true)Shows ingredients/foods within the user's virtual pantry.**
**![View Ingredient Page](/MOCKUP/LMC_view_ingredients_page.png?raw=true)Shows some attributes of the ingredient/food item.**
**![Edit Ingredient Page](/MOCKUP/LMC_edit_ingredients_page.png?raw=true)Allows user to manually modify the attributes of the ingredient if necessary.**
**![Search Ingredients Page](/MOCKUP/LMC_search_ingredients_page.png?raw=true)Shows search results for an ingredient/food item name.**
**![Recipes Page](/MOCKUP/LMC_recipes_page.png?raw=true)Lists recipes the user has shown interest in (recently searched for).**
**![View Recipe Page](/MOCKUP/LMC_view_recipes_page.png?raw=true)Shows additional information for a specific recipe.**
**![Edit Recipe Page](/MOCKUP/LMC_edit_recipes_page.png?raw=true)Allows user to modify information and attributes of a specific recipe.**
**![Recipes Queue Page](/MOCKUP/LMC_recipes_queue_page.png?raw=true)Shows queue of recipes the user will be making in the near future. Ingredients in green have sufficient amounts to be utilized for that given recipe at that point in the queue. Ingredients in red will not have sufficient amounts and should be restocked before the recipe is prepared.**


## Testing Notes

**Is there anything special we need to know in order to effectively test your app? (optional):**

* If the image of a food or recipe is clicked and replaced with a picture from a camera (or file), the object must be "saved" in order for the displayed image to refresh. This is the indicator that the image has successfully saved to blob storage.



## Screenshots of Site (complete)

**[Add a screenshot of each key page](https://stackoverflow.com/questions/10189356/how-to-add-screenshot-to-readmes-in-github-repository)
along with a very brief caption:**

![](https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif)



## External Dependencies

**Document integrations with 3rd Party code or services here.
Please do not document required libraries (e.g., React, Azure serverless functions, Azure nosql).**

* Edamam: 3rd party API database which our application uses for 'looking up' foods and recipes
* Azure Blob Storage: Used to hold the images users upload to replace the default ones provided by Edamam

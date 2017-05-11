What dataset did you use and why? McDonald's menu nutrition info, to understand how nutritous (or not) the menu is.
Food is more dense than beverages which is expected

What did you learn about the dataset from your exploration?
I found out that the top five items in regards to saturated fats equal or more than 100% of the daily limit. Also discovered that the dessert had the highest calories/oz with 77.98233. Also learned that coffee has 0-1 calories a serving.

What challenges did you face (due to R, the dataset, or formating), and how did you overcome them?

The Serving Size data was a little troublesome, it was typically formatted as "n.m oz (y grams)", developing a regex that preserved only the numbers before and after as well as the period in between was difficult. Ended up making a regex that kept all numbers and then truncating the last 2 or 3 digits (the gram digits) off that number depending on the length. There were also a few that didn't have the first section as oz's but rather as cookies, so I had to manually calculate and insert oz data. Also there were a few drinks that in oz's instead of fl oz's, so I removed them from the drinks and added them to the food. Had to manually change the drinks that had units in cartons (253ml) to fl oz.

The calculation also has some limitations, the foods is in oz and the drinks is in fl oz, the former measures weight and the latter measures volume but we can't convert from one to the other without knowing the density of the fluid, but using them as the same unit should roughly give us an idea of caloric density relative to each other.

Couldn't quite get the graphs the way I had wanted, I was going for the each category as a star graph where the Internal node would be the category, and the external nodes the items, where the size of the node grew with the average caloric density of the and the size of each external node was a function of caloric density. 

Couldn't get them into the start configuration so settled for rendering a circle as the "internal node" with the vertices.
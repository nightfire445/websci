
rm(list=ls(all=TRUE))
library("igraph", lib.loc="~/R/win-library/3.4")
mcdata = read.csv("C:/Users/Work/Documents/GitHub/websci/Labs/Lab8/menu.csv")  # read csv file 

categories = levels(mcdata[0,1])

drinklabels = categories[c(2,8,5)]
foodlabels = categories[c(1,3,4,6,7,9)]

foodsRaw = foods = mcdata[mcdata[,1] %in% categories[c(1,3,4,6,7,9)],1:ncol(mcdata) ]
drinks = drinksRaw = mcdata[mcdata[,1] %in% categories[c(2,8,5)],1:ncol(mcdata) ]
#Isolate drinks that don't have fl oz
foodDrinks = mcdata[253:nrow(mcdata),1:ncol(mcdata) ]

#Remove foodDrinks from drinks
drinks = drinksRaw = drinks[!(drinks$Item %in% foodDrinks$Item),  ] 
#Add foodDrinks to foods
foodsRaw = foods =rbind( foodsRaw, foodDrinks)
rm(foodDrinks)

#Remove everything but numbers and periods
ServingSizeOZRaw = gsub("[^\\d{1,2}.\\d{1}+]","",foodsRaw[,3], perl="TRUE")
rm(foodsRaw)
#remove extranous g data
for(i in 1:length(ServingSizeOZRaw)){
  #Need to account for n.abc and mn.abcd, we strip of 2 in the former and 3 in the latter
  if(nchar(ServingSizeOZRaw[i]) == 5){
    ServingSizeOZRaw[i] = substr(ServingSizeOZRaw[i], 1, nchar(ServingSizeOZRaw[i])-2)
  }
  else{ServingSizeOZRaw[i] = substr(ServingSizeOZRaw[i], 1, nchar(ServingSizeOZRaw[i])-3)}
  
}

foods[,3] = ServingSizeOZRaw

rm(ServingSizeOZRaw)

#convert 1 cookie (33g) to oz, which is 1.2 with sig figs
foods[105,3] = 1.2
foods[106,3] = 1.2
#Restore 1 oz to the kids ice cream cone
foods[107,3] = 1
#Restore 2 oz to the hash brown
foods[39, 3] = 2
foodsCD = foods[,3]

#Remove everything but numbers and periods
ServingSizeFlRaw = gsub("[^\\d]","",drinksRaw[,3], perl="TRUE")

#remove extranous g data
for(i in 1:length(ServingSizeFlRaw)){
  if(nchar(ServingSizeFlRaw[i]) == 4 )
  #Need to account for n.abc and mn.abcd, we strip of 2 in the former and 3 in the latter
    ServingSizeFlRaw[i] = substr(ServingSizeFlRaw[i], 1, 1)
  
}
drinks[, 3] = ServingSizeFlRaw
#Need to convert 1 carton, 226 ml to fl oz
drinks[21,3] = 8.0
drinks[22,3] = 8.0
drinksCD = ServingSizeFlRaw
rm(ServingSizeFlRaw)
rm(drinksRaw)

#Calculate caloric density

for(i in 1:nrow(drinks)){
  drinksCD[i] =  as.numeric(drinks[i, 4]) /  as.numeric(drinks[i,3] )
}

drinksItemCD = data.frame(drinks[,1:2])
colnames(drinksItemCD) = "Item"
drinksItemCD["Caloric Density"] = drinksCD



#Calculate caloric density

for(i in 1:nrow(foods)){
  foodsCD[i] =  as.numeric(foods[i, 4]) /  as.numeric(foods[i,3] )
  
}

foodsItemCD = data.frame(foods[,1:2])
colnames(foodsItemCD) = "Item"
foodsItemCD["Caloric Density"] = foodsCD

foodlabels = levels(foodsItemCD[,1])

Breakfast = foodsItemCD[foodsItemCD[,1] %in% "Breakfast",2:ncol(foodsItemCD) ]
BeefNPork = foodsItemCD[foodsItemCD[,1] %in% "Beef & Pork",2:ncol(foodsItemCD) ]
ChickenNFish = foodsItemCD[foodsItemCD[,1] %in% "Chicken & Fish",2:ncol(foodsItemCD) ]
SnacksNSides = foodsItemCD[foodsItemCD[,1] %in% "Snacks & Sides",2:ncol(foodsItemCD) ]
Desserts = foodsItemCD[foodsItemCD[,1] %in% "Desserts",2:ncol(foodsItemCD) ]
SmoothiesNShakesFood = foodsItemCD[foodsItemCD[,1] %in% "Smoothies & Shakes",2:ncol(foodsItemCD) ]

Beverages = drinksItemCD[drinksItemCD[,1] %in% "Beverages",2:ncol(drinksItemCD) ]
CoffeeNTea = drinksItemCD[drinksItemCD[,1] %in% "Coffee & Tea",2:ncol(drinksItemCD) ]
SmoothiesNShakesDrink = drinksItemCD[drinksItemCD[,1] %in% "Smoothies & Shakes",2:ncol(drinksItemCD) ]


breakfastg = graph(as.character(Breakfast[,1]))
V(breakfastg)$size <- as.numeric(Breakfast[,2])
V(breakfastg)$label.cex = .5
V(breakfastg)$label.color = "red"
breakfastAverageCD = mean(as.numeric(Breakfast[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Breakfast"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(breakfastg, vertex.size=V(breakfastg)$size*0.20, vertex.color = "blue", add=TRUE)

chickennfishg = graph(as.character(ChickenNFish[,1]))
V(chickennfishg)$size <- as.numeric(ChickenNFish[,2])
V(chickennfishg)$label.cex = .5
V(chickennfishg)$label.color = "red"
breakfastAverageCD = mean(as.numeric(ChickenNFish[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Chicken & Fish"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(chickennfishg, vertex.size=V(chickennfishg)$size*0.20, vertex.color = "blue", add=TRUE)

desserts = graph(as.character(SnacksNSides[,1]))
V(desserts)$size <- as.numeric(SnacksNSides[,2])
V(desserts)$label.cex = .5
V(desserts)$label.color = "red"
breakfastAverageCD = mean(as.numeric(SnacksNSides[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Snacks & Sides"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(desserts, vertex.size=V(desserts)$size*0.20, vertex.color = "blue", add=TRUE)

desserts = graph(as.character(Desserts[,1]))
V(desserts)$size <- as.numeric(Desserts[,2])
V(desserts)$label.cex = .5
V(desserts)$label.color = "red"
breakfastAverageCD = mean(as.numeric(Desserts[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Desserts"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(desserts, vertex.size=V(desserts)$size*0.20, vertex.color = "blue", add=TRUE)

smoothiesnshakesfood = graph(as.character(SmoothiesNShakesFood[,1]))
V(smoothiesnshakesfood)$size <- as.numeric(SmoothiesNShakesFood[,2])
V(smoothiesnshakesfood)$label.cex = .5
V(smoothiesnshakesfood)$label.color = "red"
breakfastAverageCD = mean(as.numeric(SmoothiesNShakesFood[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Smoothies & Shakes"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(smoothiesnshakesfood, vertex.size=V(smoothiesnshakesfood)$size*0.20, vertex.color = "blue", add=TRUE)

beverages = graph(as.character(Beverages[,1]))
V(beverages)$size <- as.numeric(Beverages[,2])
V(beverages)$label.cex = .5
V(beverages)$label.color = "blue"
breakfastAverageCD = mean(as.numeric(Beverages[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Beverages"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(beverages, vertex.size=V(beverages)$size*0.20, vertex.color = "red", add=TRUE)

coffentea = graph(as.character(CoffeeNTea[,1]))
V(coffentea)$size <- as.numeric(CoffeeNTea[,2])
V(coffentea)$label.cex = .5
V(coffentea)$label.color = "blue"
breakfastAverageCD = mean(as.numeric(CoffeeNTea[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Coffee & Tea"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(coffentea, vertex.size=V(coffentea)$size*0.20, vertex.color = "red", add=TRUE)

smoothiesnshakesdrink = graph(as.character(SmoothiesNShakesDrink[,1]))
V(smoothiesnshakesdrink)$size <- as.numeric(SmoothiesNShakesDrink[,2])
V(smoothiesnshakesdrink)$label.cex = .5
V(smoothiesnshakesdrink)$label.color = "blue"
breakfastAverageCD = mean(as.numeric(SmoothiesNShakesDrink[["Caloric Density"]]));
breakfastcenter = make_empty_graph(n = 1, directed = F)
V(breakfastcenter)$label = "Smoothies & Shakes Drink"
V(breakfastcenter)$size = breakfastAverageCD*3
par(mfrow=c(1,1))
plot(breakfastcenter)
plot(smoothiesnshakesdrink, vertex.size=V(smoothiesnshakesdrink)$size*0.20, vertex.color = "red", add=TRUE)
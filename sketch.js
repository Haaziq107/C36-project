//Create variables here
var dog, happyDog, database, foodS, foodStock,dogsad;
var NOTE;
var feed,addFood;
var fedTime, lastFed;
var foodObj;
var bedroom,washroom,garden;
var gameState;

function preload(){
  //load images here
  dogsad=loadImage("images/dogImg.png");
  bedroom=loadImage("images/Bed Room.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  happyDog=loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500,500);
  database=firebase.database();
  dog = createSprite(250,250);
  dog.addImage(dogsad);
  dog.scale=0.1;

  foodObj=new Food();

  feed=createButton('Feed the dog')
  feed.position(100,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(200,95);
  addFood.mousePressed(addFoods);

  var foodStockRef=database.ref('Food');
  foodStockRef.on("value",readStock);

  readState=database.ref('gameState');
  readState.on("value",function(data){ 
    gameState=data.val();
  });
}

function draw() {  
  background(46, 139, 87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){ 
    lastFed=data.val();
  });
  textSize (15)
  fill(255,255,255);
  if(lastFed>=12){
    text("Last Feed : "+lastFed%12+"PM",350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed +"AM",350,30);
  }
  currentTime=hour();
  if(currentTime==(lastFed+1)){
     update("Playing"); foodObj.garden();
     }else if(currentTime==(lastFed+2)){ update("Sleeping");
      foodObj.bedroom();
     }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ update("Bathing");
      foodObj.washroom();
     }else
     { update("Hungry") ;
     foodObj.display();
     } if(gameState!="Hungry"){
        feed.hide();
       addFood.hide();
       dog.remove();
       }else{ 
         feed.show();
         addFood.show();
          dog.addImage(dogsad); }

  drawSprites();
  //add styles here
  //text("Note:Press UP_ARROW key To Feed Drago Milk! ",100, 100);
}


  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }

  function feedDog(){
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
    FeedTime:hour()
    })
  }
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}

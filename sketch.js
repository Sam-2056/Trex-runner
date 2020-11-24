var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud
var score;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, gameOverImage
var restart, restartImage

var HIscore;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  groundImage = loadImage("ground2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  cloudImage = loadImage("cloud.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600,200)
  
  score=0
  HIscore=0
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40)
  
  //trex.debug=true
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //generate random numbers
  var rand =  Math.round(random(1,100))
  //console.log(rand)

  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  gameOver = createSprite(300,80)
  restart = createSprite(300,120)
  gameOver.addImage(gameOverImage)
  gameOver.scale = 0.7
  restart.addImage(restartImage)
  restart.scale = 0.5
}

function draw() {
  //set background color
  background(255);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4 + 3*score/100);

  gameOver.visible = false
  restart.visible = false
    
    score = score+Math.round(getFrameRate()/60)
    if (score>0 && score % 1000 === 0) {
      checkPointSound.play();
    }
    
      // jump when the space key is pressed
  if(keyDown("space")&& trex.y >= 161.5) {
    trex.velocityY = -12;
      jumpSound.play();
  }
    
    trex.velocityY = trex.velocityY + 0.8
      if (ground.x < 0){
    ground.x = ground.width/2;
  }
    
    //Spawn Clouds
  spawnCactus();
  spawnClouds();
  
    if(trex.isTouching(obstaclesGroup)){
     // trex.velocityY = -12;
      //jumpSound.play();
      gameState = END
      dieSound.play();
    }
    
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;
    trex.velocityY = 0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    
  gameOver.visible = true
  restart.visible = true
    
    if (mousePressedOver(restart)) {
    reset();
  }
  }
  
  text("score: " + score,500,50);
  text("HIscore: "+HIscore,400,50);
  
  //console.log(trex.y)
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  
  if (HIscore < score) {
    HIscore = score
  }
  score = 0
}

//function to spawn the clouds
function spawnClouds(){
if (frameCount%60===0){
cloud = createSprite(600,100,20,50);
cloud.velocityX = -4;
var rand = Math.round(random(20,100));
cloud.y = rand;
cloud.addImage("cloud",cloudImage);
//console.log (cloud.depth)
cloud.depth = trex.depth;
trex.depth = trex.depth +1
cloud.lifetime = 220
cloudsGroup.add(cloud);
}
}

function spawnCactus(){
//var rand1= Math.round(random(80,130));
if (frameCount%80===0){
var Cactus = createSprite(600,162,30,50)
Cactus.velocityX = -(6 + 3*score/100);
//Cactus.addImage("Cactus",cloudImage);
var rand= Math.round(random(1,6));
  switch(rand){
    case 1:Cactus.addImage(obstacle1);
    break;
    case 2:Cactus.addImage(obstacle2);
    break;
    case 3:Cactus.addImage(obstacle3);
    break;
    case 4:Cactus.addImage(obstacle4);
    break;
    case 5:Cactus.addImage(obstacle5);
    break;
    case 6:Cactus.addImage(obstacle6);
    break;
  }
  Cactus.scale=0.5
  Cactus.lifetime = 220
  obstaclesGroup.add(Cactus);
}
}



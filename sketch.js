var Score = 0, GameState = "Play", Over, OverPic, Restart, RestartPic;
var Jump, Die, Checkpoint
var Trex, TrexSkin, TrexEnd;
var Ground, Level, GroundSkin;
var Cloud, CloudGroup, CloudSKin, Mix, CloudCover;
var Obstacle, ObstacleGroup, ObstacleMachine, Make;

function preload(){
  TrexSkin = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  TrexEnd = loadAnimation("trex_collided.png");
  
  CloudSkin = loadImage("cloud.png");
 
  GroundSkin = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  OverPic = loadImage("gameOver.png")
  RestartPic = loadImage("restart.png")
  
  Die = loadSound("die.mp3");
  Checkpoint = loadSound("checkPoint.mp3");
  Jump = loadSound("jump.mp3");
}

function setup() {
  createCanvas(800, 400);
  
  CloudGroup = createGroup();
  ObstacleGroup = createGroup();

  Trex = createSprite(50,360,25,50);
  Trex.addAnimation("Running", TrexSkin);
  Trex.addAnimation("Collided", TrexEnd)
  Trex.scale = 0.75;
  //Trex.debug = true;
  Trex.setCollider("Rectangle", 0, 0, 80, 100)
  
  
  Ground = createSprite(200,380,800,20);
  Ground.addImage("ground",GroundSkin);

  
  Level = createSprite(400, 395, 800, 5);
  Level.visible = false;
}

function ObstacleMachine(){
  if(frameCount % 100 == 0){
    Obstacle = createSprite(900,360,20,40);
    
    Obstacle.velocityX = -(5 + 0.25 * Score/250);
    Obstacle.scale = 0.5;
    Obstacle.depth = 1;
    
    
    Obstacle.lifetime = 200;
    ObstacleGroup.add(Obstacle);
    
    Make = Math.round(random(1,6));
    switch(Make){
        case 1: Obstacle.addImage(obstacle1);
        break;
        case 2: Obstacle.addImage(obstacle2);
        break;
        case 3: Obstacle.addImage(obstacle3);
        break;
        case 4: Obstacle.addImage(obstacle4);
        break;
        case 5: Obstacle.addImage(obstacle5);
        break;
        case 6: Obstacle.addImage(obstacle6);
        break;
        default: break;
    }
     }
}

function CloudCover(){
  if(frameCount % 100 == 0){
    Mix = Math.round(random(75,125));
    
    Cloud = createSprite(800,Mix,50,10);
    Cloud.addImage(CloudSkin);
    
    Cloud.velocityX = -(2.5 + 0.25 * Score/250);
    Cloud.depth = -3;
    
    Cloud.lifetime = 200;
    CloudGroup.add(Cloud);
    
    
}
  }

function Reset(){
  GameState = "Play";
  Trex.changeAnimation("Running", TrexSkin);
  Over.visible = false;
  Restart.visible = false;
  CloudGroup.destroyEach();
  ObstacleGroup.destroyEach();
  Ground.velocityX = 10;
  Score = 0;
}

function draw() {
  background("Blue");
  
  if (GameState == "Play"){
    
    textSize(20);
    text("Score: " + Score,680,20);
    Score = Score + Math.round(frameCount/100);
    
    if (Trex.isTouching(ObstacleGroup) ){
    Die.play();
    GameState = "End"
    
    Over = createSprite(400, 100, 300, 100);
    Over.addImage(OverPic)
    Restart = createSprite(400, 200, 50,50);
    Restart.addImage(RestartPic);
  }
    
    if (Score % 250 == 0 && Score > 0){
      Checkpoint.play()
    }
    
    CloudCover();
    ObstacleMachine();

    if (keyDown("space") && Trex.y >= 350) {
      Trex.velocityY = -15;
      Jump.play();
    }
    Trex.velocityY = Trex.velocityY + 0.5;
    
    Ground.velocityX = -(5 + 0.25 * Score/250);
    if (Ground.x < 0) {
      Ground.x = Ground.width / 2;
    }}
  
  if (GameState == "End"){
    Trex.velocityY = 0;
    Ground.velocityX = 0;
    ObstacleGroup.setVelocityXEach(0);
    CloudGroup.setVelocityXEach(0);
    ObstacleGroup.setLifetimeEach(-1)
    CloudGroup.setLifetimeEach(-1);
    Trex.changeAnimation("Collided",TrexEnd);
    if (mousePressedOver(Restart)){
      Reset();
    }
  }
    
  Trex.collide(Level);
  drawSprites();
}

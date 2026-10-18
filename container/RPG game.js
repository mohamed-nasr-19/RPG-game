
const canvas = document.getElementById("canvas-game")
const ctx = canvas.getContext("2d");
const levelcircle = document.getElementById("level-circle")
const barHP = document.getElementById("bar-hp")
const barfillHP = document.getElementById("bar-fill-hp")
const bartextHP = document.getElementById("bar-text-hp")
const barMANA = document.getElementById("bar-MANA")
const barfillMANA = document.getElementById("bar-fill-mana")
const bartextMANA = document.getElementById("bar-text-mana")
const barENERGY = document.getElementById("bar-energy")
const barfillENERGY = document.getElementById("bar-fill-energy")
const bartexTENERGY = document.getElementById("bar-text-energy")

const xpRing = document.getElementById("xp-ring")
const pathLength = xpRing.getTotalLength()

 xpRing.style.strokeDasharray = pathLength 
 xpRing.style.strokeDashoffset = pathLength
 
canvas.width= 1920;
canvas.height = 900;


function updatebar(){
     if(player.HP <= 0){
    player.HP = Math.max(0, player.HP)
   }
    const HPpercentage = player.HP / player.maxHP
    const manapercentage = player.mana / player.maxmana;
    const energypercentage = player.energy / player.maxenergy
    bartextHP.textContent = `${player.HP} / ${player.maxHP}`
    bartextMANA.textContent = `${player.mana} / ${player.maxmana}`;
    bartexTENERGY.textContent = `${player.energy} / ${player.maxenergy}`;
    barfillHP.style.width = `${Math.max(0, Math.min(HPpercentage, 1)) * 100}%`;
    barfillMANA.style.width = `${Math.max(0, Math.min(manapercentage, 1)) * 100}%`
     barfillENERGY.style.width = `${Math.max(0, Math.min(energypercentage, 1)) * 100}%`
    if(player.HP <= player.maxHP * 30 / 100){
        barHP.classList.add("low-hp");
    }    
    else{
     barHP.classList.remove("low-hp");
    }         
}

function updateXPring(){
    const XPpercentage = Math.max(0, Math.min(player.XP / player.XPneeded, 1))

    xpRing.style.strokeDashoffset = pathLength * (1 - XPpercentage)
    levelcircle.textContent = player.lvl

}


function triggerFlash(el, duration = 250){
    el.classList.remove("flash");
    void el.offsetWidth;
     // forces the browser to "notice" the removal before re-adding
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), duration);
}

const player = {
    x: 100,
    y: 500,
    width: 25, 
    height: 25,
    isDead: false,
    respawnScheduled: false,
    velocityX: 0,
    velocityY: 0,
    HP: 900,
    maxHP: 900,
    atkRange: 200,
    atk: 12,
    def: 10,
    speed: 12,
    lvl:1,
    XP: 0,
    XPneeded: 0,
    mana: 100,
    maxmana: 100,
    energy: 100,
     maxenergy: 100,
    gold: 0,
    WP: null,
    abilities: null,
    unlockedskills : [],
    equippedskills : [],
    skillscoooldownremaining : {
    Fireball : 0,
    ElectronsChain:  0,
    IceSpikes :  0,
    MindControl :  0,
    WizardDomain :  0
    },
    facingDirection : null
}
bartextHP.textContent = `${player.HP} / ${player.maxHP}`

bartextMANA.textContent = `${player.mana} / ${player.maxmana}`;

bartexTENERGY.textContent = `${player.energy} / ${player.maxenergy}`;
let enemyData;
let ItemData;
let lootData;
let skillData;
let weaponData;
let armorData;

const enemies = []

const tileWidth = 40;
const tileHeight = 40;

const grass = {
    type: "grass",
 tileWidth : 40,
 tileHeight : 40,
}

const tree = {
    type: "tree",
  isSolid: true,
  width : tileWidth,
  height : tileHeight,
}

function gameloop(){
    update();
    draw();

    requestAnimationFrame(gameloop);
}
let lastUpdatetime = Date.now();
 let now = Date.now()
 let elapsedTime = 0
function update(){
    let collisiondetected = false
     
    deathdetection(player);
    obstacles.forEach(obstacle =>{
     if(checkCollision(player, obstacle)){
        collisiondetected = true;
    }
    })
    if(collisiondetected){
        player.velocityX = 0;
        player.velocityY = 0;
    } 

    player.x += player.velocityX;
    player.y += player.velocityY;

  player.x = Math.max(0, Math.min(player.x, canvas.width - player. width));

   player.y = Math.max(0, Math.min(player.y, canvas.height - player.height));
    GoldpickUpdetection();

enemies.forEach((enemy) =>{
    let collisiondetected = false;
    
    deathdetection(enemy);
    enemyAI(enemy);

    obstacles.forEach(obstacle =>{
    if(checkCollision(enemy, obstacle)){
        collisiondetected = true;
        
    }
    })
 
    if(enemy.isDead && !enemy.respawnScheduled){
        giveXP(enemy);
        generateLoot(enemy);
        createGoldDrop(enemy);
        enemy.respawnScheduled = true
        spawnEnemy(enemy.enemyType)
      }
      if(enemy.isDead && !enemy.lootGenerated){
        enemy.lootGenerated = true
      }
    
     if(collisiondetected){
        enemy.velocityX = 0;
        enemy.velocityY = 0;
    }

     enemy.x += enemy.velocityX;
    enemy.y +=enemy.velocityY;
     
  
})
 for(let i = enemies.length - 1; i >= 0; i--){
    if(enemies[i].isDead){
       
        enemies.splice(i, 1)
        
    }
 }

}
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    renderMap();

    if(!player.isDead){
        ctx.fillStyle = "red";
        ctx.fillRect(player.x, player.y, player.width, player.height)
    }
  
enemies.forEach(enemy =>{
       if(!enemy.isDead){
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y,enemy.width, enemy.height)
       }
    })
    goldsDrop.forEach(goldDrop =>{
    ctx.fillStyle = "yellow" 
    ctx.fillRect(goldDrop.x, goldDrop.y, 5, 5)
   })
   itemsDrop.forEach(itemDrop =>{
    ctx.fillStyle = "white"
    ctx.fillRect(itemDrop.x, itemDrop.y, 5, 5)
   })
   projectiles.forEach(p =>{
    ctx.fillstyle = "orange"
    ctx.fillRect(p.x, p.y, p.width, p.height)
   })
   
}


const mapPattern = [
    "................................................",
    "........T.......................................",
    "................................................",
    "........................T.......................",
    "................................................",
    "......................................T.........",
    "................................................",
    ".....T..........................................",
    "................................................",
    ".........................T......................",
    "................................................",
    "....................................T...........",
    "..............T.................................",
    "................................................",
    "................................................",
    "..............................T.................",
    "................................................",
    "......T.........................................",
    "................................................",
    "........................T.......................",
    "................................................",
    "...............T.......................T........",
    "................................................",
   
];
const obstacles = []
const map = mapPattern.map(
    (row, rowIndex) =>[...row].map(
        (tile, colIndex)  => {
          if(tile === "T"){
        const newTree = {
       type: "tree",
       x: colIndex * tileWidth,
       y: rowIndex * tileHeight,
       width: tileWidth,
       height: tileHeight
  };
       obstacles.push(newTree);
       return newTree;
        }
         if(tile === "."){
        grass.width = tileWidth
         grass.height = tileHeight
         return grass;
        }
      }
    ))

document.addEventListener("keydown", event =>{   
    
     if(event.key === "q"){
        player.velocityX = -player.speed;
     }
     if(event.key === "w"){
        player.velocityY = +player.speed;
     }
     if(event.key=== "s"){
    player.velocityY  = -player.speed;
     }
     if(event.key === "d"){
        player.velocityX = +player.speed;
     }
  
})

document.addEventListener("keyup", event =>{
     event.preventDefault();
     if(event.key === "q"){
        player.velocityX = 0;
     }
     if(event.key === "w"){
        player.velocityY = 0;
     }
     if(event.key=== "s"){
    player.velocityY = 0;
     }
     if(event.key === "d"){
        player.velocityX = 0;
     }

    
})
  
document.addEventListener("click", event => {
    
    
    if (player.isDead) {
        console.log("PLAYER IS DEAD");
        return;
    }
    enemies.forEach(enemy => {
        const detectionhorizontally = Math.abs(player.x - enemy.x);
        const detectionvertically = Math.abs(player.y - enemy.y);

        

        if (enemy.type === "enemy") {
            if (
                detectionhorizontally <= player.atkRange &&
                detectionvertically <= player.atkRange
            ) {
               

                if (player.skillscoooldownremaining <= 0) {
                    
                    console.log("CLICKED");

  

          console.log("enemy HP AFTER:", enemy.HP);
                    attack(player, enemy);
                    console.log("enemy HP AFTER:", enemy.HP);
                    player.skillscoooldownremaining = player.WP.cooldown;
                }
            }
        }
        
    });
   
});
document.addEventListener("keydown", event => {
    if (event.key === "z") {

        const nearItem = itempickUpdetection();

        console.log("NEAR ITEM:", nearItem);
        
        if (nearItem) {
            inventory.push(nearItem.item);
            itemsDrop.splice(itemsDrop.indexOf(nearItem), 1);

            console.log("ITEM PICKED UP:", nearItem.item);
            console.log("INVENTORY:", inventory);
            console.log("ITEM DROPS LEFT:", itemsDrop);
        }
    }
});

document.addEventListener("keydown", event => {
    const directions = {
    "UP" : [0, -1],
    "DOWN" : [0, 1],
    "LEFT" : [-1 , 0],
    "RIGHT" : [1, 0]
    }
    if(event.key === "w") {
     player.facingDirection = directions.DOWN
    }
    if(event.key === "q") {
     player.facingDirection = directions.LEFT
    }
    if(event.key === "d") {
     player.facingDirection = directions.RIGHT
    }
    if(event.key === "s") {
     player.facingDirection = directions.UP
    }
})


function renderMap(){
    for(let row = 0; row < map.length; row++){
        for(let col = 0; col < map[row].length; col++){
            
           const mapsearcher = map[row][col]
           if(mapsearcher.type === "tree"){
             let x = tileWidth * col;
            let y =tileHeight * row;
            ctx.fillStyle = "green";
            ctx.fillRect(x, y,tree.width, tree.height)
           }
           if(mapsearcher.type  === "grass"){
             let x = tileWidth * col;
            let y = tileHeight * row;
            ctx.fillStyle = "lightgreen";
            ctx.fillRect(x, y ,grass.tileWidth, grass.tileHeight)
           }
        }
    }
}


function playerdetector(enemy){
  const verticaldifference = Math.abs(4000);
  const horizontaldifference = Math.abs(4000);
  const detectionhorizontally = (Math.abs(player.x - enemy.x))
  const detectionvertically = (Math.abs(player.y -enemy.y))

  if(detectionvertically <= verticaldifference && detectionhorizontally <= horizontaldifference){
    return true
  }
  return false;
  
}

function playerChaser(enemy){
    if(playerdetector(enemy)){
        const horizontalplayer = Math.sign(player.x - enemy.x)
        const verticalplayer = Math.sign(player.y - enemy.y)
        if(horizontalplayer === Math.sign(+1) && verticalplayer === Math.sign(+1)){
        enemy.velocityX = horizontalplayer * enemy.speed
         enemy.velocityY =  verticalplayer * enemy.speed

        }
         if(horizontalplayer === Math.sign(-1) && verticalplayer === Math.sign(-1)){
           enemy.velocityX = horizontalplayer * enemy.speed
           enemy.velocityY = verticalplayer* enemy.speed
        }
        if(horizontalplayer === Math.sign(+1) && verticalplayer === Math.sign(-1)){
          enemy.velocityX = horizontalplayer * enemy.speed
           enemy.velocityY = verticalplayer* enemy.speed
        }
        if(horizontalplayer === Math.sign(-1) && verticalplayer === Math.sign(+1)){
           enemy.velocityX = horizontalplayer * enemy.speed
           enemy.velocityY = verticalplayer* enemy.speed
        }
    }
    else{
       enemy.velocityX = 0;
        enemy.velocityY = 0;
    }
     
  return null
}

function attack(attacker, defender){ 
    
    let damage = attacker.atk - defender.def;
    if(damage <= 0){
        damage = 1;
    }
    console.log(
    "ATTACK:",
    attacker.enemyType || "PLAYER",
    "ATK:", attacker.atk,
    "DEF:", defender.def,
    "DAMAGE:", damage
);
    let newHP = defender.HP - damage;
    defender.HP= newHP
    updatebar();
    
}

function enemyAI(enemy){
    if(enemy.isDead){
    enemy.velocityX = 0
     enemy.velocityY = 0
     return;
  }
 if(playerdetector(enemy)){
    const detectionhorizontally = (Math.abs(player.x - enemy.x))
    const detectionvertically = (Math.abs(player.y - enemy.y))
    
  if(detectionhorizontally <= enemy.atkRange && detectionvertically <= enemy.atkRange){
    
    enemy.velocityX = 0;
    enemy.velocityY = 0;
    if(enemy.attackcooldownremaining <= 0){
        console.log("BEFORE ATTACK HP:", player.HP);

    attack(enemy, player)

    console.log("AFTER ATTACK HP:", player.HP);
    enemy.attackcooldownremaining = enemy.WP.cooldown;
    triggerFlash(barHP)
    }
  
}
  else{
    playerChaser(enemy);
  }
} 
    else{
        enemy.velocityX = 0
         enemy.velocityY = 0
    }

 }


function deathdetection(entity){
   if(entity.HP <= 0){
    entity.isDead = true;
   }
}

function checkCollision(entity, obstacle){
    let futurX =  entity.x + entity.velocityX
    let futurY =  entity.y + entity.velocityY
    let futurLeft = futurX
    let futurRight = futurLeft + entity.width
    let futurtop =  futurY
    let futurbottom = futurtop + entity.height
    let leftobstacle =  obstacle.x 
    let rightobstacle =  obstacle.x + obstacle.width
    let topobstacle =  obstacle.y
    let bottombstacle = obstacle.y + obstacle.height

    if(
        futurRight > leftobstacle && futurLeft < rightobstacle    && futurbottom  > topobstacle && futurtop <  bottombstacle
     ){
       return true
    }
    return false;
}

function spawnEnemy(enemyType, delay = 5000) {
    setTimeout(() => {

        let spawnX;
        let spawnY;

        if (player.x < canvas.width / 2) {
            spawnX = canvas.width;
        } else {
            spawnX = -20;
        }

        spawnY = Math.random() * (canvas.height - 20);

        const enemy = createEnemy(enemyType);

        enemy.x = spawnX;
        enemy.y = spawnY;

        enemies.push(enemy);

    }, delay);
}

function createEnemy(type){
    const data = enemyData[type]
  
    return {
    ...data, 
        enemyType: type,
        x: 0,
        y: 0,
        WP: createItem(data.weapon),
        HP: data.maxHP,
        velocityX: 0,
        velocityY: 0,
        isDead: false,
        respawnScheduled: false,
        isgoldDropped: false,
        attackcooldownremaining: 1000,
        lastElectricHitTime: 0,
        electricHitCount : 0,
        isStunned: false,
        stunnedUntil: 0
    }
}


function createItem(type){
    const data = ItemData[type]
    return{
      ...data, 
    }
}

function createskills(type){
    const data = skillData[type]

    return{
     ...data, 
    skillType: type

    }
}

function createweapons(type){
     const Data = weaponData[type] 

     return {
        ...Data,
        weaponType: type

     }
}

function createarmors(type){
     const Data = armorData[type] 

     return {
        ...Data,
        armorType: type
     }
}

const A = 100 
const p = 1.5
  function getXPneeded(level){
    return A * level ** p
  }
  
function giveXP(enemy){
     if(enemy.isDead){
     const gainedXP = getEnemyXP(enemy);

     player.XP += gainedXP;
      console.log("XP GAINED:", gainedXP);
        console.log("CURRENT XP:", player.XP);
        console.log("CURRENT LEVEL:", player.lvl);
        console.log("XP NEEDED:", player.XPneeded);
    checkLevelUP();
     updateXPring()
     }
     
     
}
function getEnemyXP(enemy){
   const E = enemy.lvl

   const B = enemy.baseXP
   const q = 1.3
   const XPamount = B * E**q
  
   return XPamount
  
}
function checkLevelUP(){
   
    while(player.XP >= player.XPneeded){
     player.XP = player.XP - player.XPneeded
     player.lvl++;
      const HPstatsformula =  8*player.lvl**1.2
    const atkstatsformula =   2*player.lvl**1.3
    const defstatsformula =  3*player.lvl**1.2

     player.maxHP += Math.floor(HPstatsformula)
    player.atk +=  Math.floor(atkstatsformula)
    player.def +=  Math.floor(defstatsformula)
    player.XPneeded = getXPneeded(player.lvl)
    

    console.log("🎉 LEVEL UP!");
        console.log("NEW LEVEL:", player.lvl);
        console.log("REMAINING XP:", player.XP);
        console.log("NEW XP NEEDED:", player.XPneeded);
        console.log("MAX HP:", player.maxHP);
        console.log("ATK:", player.atk);
        console.log("DEF:", player.def);
   
    }
}

function generateLoot(enemy) {
    const lootable = lootData[enemy.enemyType];

    console.log("LOOT GENERATION STARTED:", enemy.enemyType);

    if (enemy.isDead) {
        for (let i = 0; i < lootable.items.length; i++) {

            const lootEntry = lootable.items[i];

            console.log(
                "ROLLING:",
                lootEntry.item,
                "CHANCE:",
                lootEntry.chance
            );

            const didDrop = lootRoll(lootEntry);

            console.log(
                "RESULT:",
                lootEntry.item,
                didDrop
            );

            if (didDrop) {
                const item = createItem(lootEntry.item);

                console.log("ITEM DROPPED:", item);

                createItemDrop(item, enemy);
            }
        }
    }
}

function lootRoll(item){ 
    const max = 100;
    const min = 1
    
    const randomNumber = Math.floor(Math.random() * max) + min;
    if(randomNumber <= item.chance){
        return true;
    }
    return false;
}

const itemsDrop = []
function createItemDrop(item, enemy) {
    const newDrop = {
        item: item,
        type: "item",
        x: enemy.x,
        y: enemy.y,
        name: item.name,
        rarity: item.rarity,
        value: item.value,
        itemRange: 20,
        lootGenerated: false
    };

    itemsDrop.push(newDrop);

    console.log("ITEM DROP CREATED:", newDrop);
    console.log("ALL ITEM DROPS:", itemsDrop);
}

const goldsDrop = []
function createGoldDrop(enemy){
    const goldInfo = lootData[enemy.enemyType].gold
    const goldAmount = Math.floor(Math.random() *(goldInfo.max -goldInfo.min + 1)) + goldInfo.min
    if(enemy.isDead && !enemy.isgoldDropped){
        enemy.isgoldDropped = true;
            const newGoldDrop = {
                type: "gold",
                name: "Gold",
                x: enemy.x,
                y: enemy.y,
                amount:goldAmount
            }
            goldsDrop.push(newGoldDrop)
    }
}


function itempickUpdetection(){
    for(let i = 0; i < itemsDrop.length; i++){
       const item = itemsDrop[i];

       const detectionhorizontally = Math.abs(player.x - item.x)
        const detectionvertically = Math.abs(player.y - item.y)

        if( detectionhorizontally <= item.itemRange && detectionvertically <= item.itemRange){
            return item
        }
        
    }
    return null
}

function GoldpickUpdetection(){
     for(let i = goldsDrop.length - 1; i >= 0; i--){
        const gold = goldsDrop[i]
         const verticaldifference = Math.abs(100);
         const horizontaldifference = Math.abs(100);
        const detectionhorizontally = Math.abs(player.x - gold.x)
        const detectionvertically = Math.abs(player.y - gold.y)
        if(detectionhorizontally <= horizontaldifference &&  detectionvertically <= verticaldifference ){
            inventory.push(gold);
            goldsDrop.splice(i, 1)
            player.gold  += gold.amount
        }
}
}

player.XPneeded = getXPneeded(player.lvl)
const inventory = []


function skillsCooldown(skill){
     player.skillscoooldownremaining[skill] -=  elapsedTime
     if(player.skillscoooldownremaining[skill] <= 0){
         player.skillscoooldownremaining[skill] = 0
         return true
     }
    return false
}

function unlockedskill(skillname){
    const Data = skillData[skillname]
    if(!Data){
        return;
    }
   if(player.lvl >= Data.identity.requiredLevel && !player.unlockedskills.includes(skillname)){
    player.unlockedskills.push(skillname)
    return true;
   }
   return false
}

function equippedskill(skillname){
    const slotLimit = 5
    if(unlockedskill(skillname)){
        if(player.equippedskills.length >= slotLimit){
            return;
        }
        if(!player.equippedskills.includes(skillname)){
            player.equippedskills.push(skillname)
        }
    return true
    }
    return false
}

 const directions = {
    "UP" : [0, -1],
    "DOWN" : [0, 1],
    "LEFT" : [-1 , 0],
    "RIGHT" : [1, 0]
    }

const projectiles = []
const continuousattacks = []
const areaStunAttacks = []
const areaHealingAttacks = []
const areaDamageAttacks = []

function useSkill(skill){
   const Data = skillData[skill]

   if(!Data || !Data.behaviour){
    return;
   }
   if(equippedskill(skill)){
    if(!skillsCooldown(skill)){
     if(player.mana >= Data.cost.manaCost){
        const skillBehaviour = Data.behaviour
        
        const behaviorproperties = Data[skillBehaviour]

        const executebehavior = skillRegistry[skillBehaviour]
        
        if(executebehavior){
            executebehavior(behaviorproperties)
             player.mana -= Data.cost.manaCost
         player.skillscoooldownremaining[skill] = Data.cost.cooldown        
        return true;
        }
     }
    }
   }
   return false
}

const skillRegistry = {
   
    Createprojectile: (stats, skillName) => {
        
        const projectile = {
        x: player.x,
        startingX: player.x,
        y: player.y,
        startingY: player.y,
        velocityX: 0,
        velocityY: 0,
        width: 5,
        height: 5,
        facingDirection : null,
        damage: 0,
        atkrange: 0,
        skillName : skillName
        }
        const direction = directions[player.facingDirection]
         projectile.facingDirection = player.facingDirection
        projectile.velocityX = direction[0] * stats.speed
         projectile.velocityY =  direction[1] * stats.speed
          projectile.damage = stats.damage
        projectile.atkrange = stats.atkRange

         projectiles.push(projectile)
        console.log(`Firing a projectile! Speed: ${stats.speed}, Damage: ${stats.damage}`);
    },
    updateProjectile: () =>{
      for(let i = projectiles.length - 1; i >= 0; i--){
           const projectileIndex = projectiles[i]
           projectileIndex.x += projectileIndex.velocityX
           projectileIndex.y +=  projectileIndex.velocityY
          const distanceTraveled = Math.hypot(projectileIndex.x - projectileIndex.startingX, projectileIndex.y - projectileIndex.startingY)
           
           if(distanceTraveled >=  projectileIndex.atkrange){
            projectiles.splice(i, 1);
            continue;
           }

        enemies.forEach(enemy => {
         if(checkCollision(projectileIndex, enemy)){

         projectileHitBehavior(projectileIndex, enemy)
        }
        })
        }

    },
     projectileHitBehavior: (projectile, enemy) => {
    const skillIdentifyer = projectile.skillName;
    const executeProjectile = HitProjectileRegistery[skillIdentifyer];
    if (executeProjectile) {
        executeProjectile(projectile, enemy);
        return true;
    }
    return false;
},

CreateareaStun: (stats, skillName) => {
    const areaStun = {
        x: player.x,
        y: player.y,
        startingX: player.x,
        startingY: player.y,
        damage: stats.damage,
        radius: stats.radius,
        duration: stats.durationEffect,
        createdAt: Date.now(),
        hitEnemies: new Set(),
        skillName: skillName
    };
    areaStunAttacks.push(areaStun);
    console.log(`Stunning area! Radius: ${stats.radius}px, Duration: ${stats.durationEffect}ms`);
},

updateareaStun: () => {
    for (let i = areaStunAttacks.length - 1; i >= 0; i--) {
        const areaStun = areaStunAttacks[i];

        if (Date.now() - areaStun.createdAt >= areaStun.duration) {
            areaStunAttacks.splice(i, 1);
            continue;
        }

        enemies.forEach(enemy => {
            if (enemy.isDead){
                return;
            }
            if (areaStun.hitEnemies.has(enemy)){
             return;
            } 
            if (CheckCircleCollision(areaStun, enemy)) {
                areaStun.hitEnemies.add(enemy);
                skillRegistry.areaStunHitBehavior(areaStun, enemy);
            }
        });
    }
},

areaStunHitBehavior: (areaStun, enemy) => {
    const skillIdentifyer = areaStun.skillName;
    const executeAreaStun = AreaStunRegistery[skillIdentifyer];
    if (executeAreaStun) {
        executeAreaStun(areaStun, enemy);
        return true;
    }
    return false;
},

CreateareaDamage: (stats, skillName) => {
    const areaDamage = {
        x: player.x,
        y: player.y,
        startingX: player.x,
        startingY: player.y,
        createdAt: Date.now(),
        damage: stats.damage,
        radius: stats.radius,
        duration: stats.durationEffect,
        tickInterval: stats.tickInterval || 1000,
        lastTickTime: 0,
        skillName: skillName
    };
    areaDamageAttacks.push(areaDamage);
    console.log(`Area damage! Radius: ${stats.radius}, Damage: ${stats.damage}`);
},

updateareaDamage: () => {
    for (let i = areaDamageAttacks.length - 1; i >= 0; i--) {
        const areaDamage = areaDamageAttacks[i];

        if (Date.now() - areaDamage.createdAt >= areaDamage.duration) {
            areaDamageAttacks.splice(i, 1);
            continue;
        }

        const now = Date.now();
       if (now - areaDamage.lastTickTime < areaDamage.tickInterval)
        continue;
        areaDamage.lastTickTime = now;
       
        enemies.forEach(enemy => {
            if (enemy.isDead) return;
            if (CheckCircleCollision(areaDamage, enemy)) {
                skillRegistry.areaDamageHitBehavior(areaDamage, enemy);
            }
        });
    }
},

areaDamageHitBehavior: (areaDamage, enemy) => {
    const skillIdentifyer = areaDamage.skillName;
    const executeAreaDamage = AreaDamageRegistery[skillIdentifyer];
    if (executeAreaDamage) {
        executeAreaDamage(areaDamage, enemy);
        return true;
    }
    return false;
},

CreateareaHealing: (stats, skillName) => {
    const areaHealing = {
        x: player.x,
        y: player.y,
        startingX: player.x,
        startingY: player.y,
        createdAt: Date.now(),
        healingEffect: stats.healingEffect,
        radius: stats.radius,
        duration: stats.durationEffect || 0,
        skillName: skillName
    };
    areaHealingAttacks.push(areaHealing);
    console.log(`Healing pulse! Healing power: ${stats.healingEffect * 100}%`);
},

updateareaHealing: () => {
    for (let i = areaHealingAttacks.length - 1; i >= 0; i--) {
        const areaHealing = areaHealingAttacks[i];

        if (CheckCircleCollision(areaHealing, player)) {
            skillRegistry.areaHealingHitBehavior(areaHealing, player);
        }

        areaHealingAttacks.splice(i, 1);
    }
},

areaHealingHitBehavior: (areaHealing, target) => {
    const skillIdentifyer = areaHealing.skillName;
    const executeAreaHealing = AreaHealingRegistery[skillIdentifyer];
    if (executeAreaHealing) {
        executeAreaHealing(areaHealing, target);
        return true;
    }
    return false;
},
};

function explosionEffect(caboomDamage, caboomRadius, explosionCenter) {
    enemies.forEach(enemy => {
        if (enemy.isDead) return;
        const enemyCenterX = enemy.x + enemy.width / 2;
        const enemyCenterY = enemy.y + enemy.height / 2;
        const distance = Math.hypot(explosionCenter.x - enemyCenterX, explosionCenter.y - enemyCenterY);
        if (distance <= caboomRadius) {
            enemy.HP -= caboomDamage;
        }
    });
}

function CheckCircleCollision(circle, target) {
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;
    const Distance = Math.hypot(circle.x - targetCenterX, circle.y - targetCenterY);
    return Distance <= circle.radius;
}

const areas = [];

const HitProjectileRegistery = {
    Fireball: (projectile, enemy) => {
        enemy.HP -= projectile.damage;
    },

    ElectricBolts: (projectile, enemy) => {
        const skillIdentifyer = projectile.skillName;
        const Data = skillData[skillIdentifyer];
        const stats = Data[Data.behaviour];

        if (enemy.electricHitCount === undefined){
        enemy.electricHitCount = 0;
        } 
            

        if (enemy.lastElectricHitTime &&
            Date.now() - enemy.lastElectricHitTime >= stats.chargeResetTime) {
            enemy.electricHitCount = 0;
        }

        enemy.HP -= projectile.damage;
        enemy.electricHitCount++;
        enemy.lastElectricHitTime = Date.now();

        const explosionCoordinates = {
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
        };

        if (enemy.electricHitCount === 5) {
            explosionEffect(stats.smallExplosion.damage, stats.smallExplosion.radius, explosionCoordinates);
        }
        else if (enemy.electricHitCount === 7) {
            explosionEffect(stats.midExplosion.damage, stats.midExplosion.radius, explosionCoordinates);
        }
        else if (enemy.electricHitCount === 10) {
            explosionEffect(stats.bigExplosion.damage, stats.bigExplosion.radius, explosionCoordinates);
            enemy.electricHitCount = 0;
        }
    },
};

const AreaStunRegistery = {
    MindConfusion: (areaStun, enemy) => {
        enemy.HP -= areaStun.damage;
        enemy.isStunned = true;
        enemy.stunnedUntil = Date.now() + areaStun.duration;
    }
};

const AreaDamageRegistery = {
    WizardDomain: (areaDamage, enemy) => {
        enemy.HP -= areaDamage.damage;
    }
};

const AreaHealingRegistery = {
    restoration: (areaHealing, target) => {
        target.HP = Math.min(target.maxHP, target.HP + target.maxHP * areaHealing.healingEffect);
        updatebar();
    }
};
async function LoadGamedata(){
    const itemsResponse = await fetch("./data/items.json");
    const  enemiesResponse = await fetch("./data/enemies.json");
    const lootResponse = await fetch("./data/lootables.json");
    const skillsResponse = await fetch("./data/skills.json")
    const weaponsResponse = await fetch("./data/weapons.json")
     const armorsResponse = await fetch("./data/armors.json")

     ItemData = await  itemsResponse.json();
     enemyData = await  enemiesResponse.json();
     lootData = await  lootResponse.json();
     skillData = await  skillsResponse.json();
     weaponData = await  weaponsResponse.json();
     armorData = await  armorsResponse.json();

      startGame();
}

function startGame(){
    const magicalStaff = createweapons("magicalStaff")
    player.WP = magicalStaff;
   player.XPneeded = getXPneeded(player.lvl)
  spawnEnemy("goblin", 0);
    spawnEnemy("orc", 0);
    spawnEnemy("skeleton", 0);
    spawnEnemy("dragon", 0);
    spawnEnemy("wolf", 0);
    spawnEnemy("witch", 0);
   gameloop();
} 
LoadGamedata();

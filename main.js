import { Engine, Render, Runner, World, Events, Bodies, Body, Sleeping } from "matter-js"
import { AddNewFruit } from "./modules/addNewFruit"
import { getBox } from "./modules/box"
import { FRUITS } from "./modules/fruits"

const displayScore = document.getElementById('displayScore')
let score = 0
displayScore.innerHTML = score

const displayTopScore = document.getElementById('displayTopScore')
let topScore = localStorage.getItem("topScore") || 0
displayTopScore.innerHTML = topScore

const app = document.getElementById('app')
// L'interval permet de modifier le comportement de déplacement du fruit
let interval = null
// Permet de définir si l'utilisateur à le droit de jouer le fruit
let disableAction = false

// Utilisation de base de la bibliothéque
const engine = Engine.create({})

const render = Render.create({ 
  element: app,
  engine,
  options: {
    width: 620,
    height: 840,
    wireframes: false,
    background: '#B1F1CB'
  }
})

const world = engine.world

// Permet de rajouter les rebords du terrain
getBox(world)

// Gestion du fruit utilisé
let currentFruit = {label: "",radius: "",color: ""} 
currentFruit = AddNewFruit(currentFruit)
World.add(world, [currentFruit])

// Render de l'app
Render.run(render)
const runner = Runner.create()
Runner.run(runner, engine)

//Gestion des controls
// Gestion des inputs utilisateur qd et flèches pour gauche/droite espace/flèche du bas pour lacer le fruit
 window.onkeydown = (e) => {
  if(disableAction) return;

  switch (e.code) {

      case "ArrowLeft":
      case "KeyA":
          if(interval) return;
          interval = setInterval(() => {
              if(currentFruit.position.x - 20 > 30)
              Body.setPosition(currentFruit, {
                  x: currentFruit.position.x - 1,
                  y: currentFruit.position.y
              })
          }, 5);
          break;

      case "ArrowRight":
      case "KeyD":
          if(interval) return;
          interval = setInterval(() => {
              if(currentFruit.position.x + 20 < 590)
              Body.setPosition(currentFruit, {
                  x: currentFruit.position.x + 1,
                  y: currentFruit.position.y
              })
          }, 5);
          break;

      case "ArrowDown":
      case "Space":
          disableAction = true;
          Sleeping.set(currentFruit, false)
          setTimeout(() => {
              currentFruit = AddNewFruit(currentFruit)
              World.add(world, currentFruit)
              disableAction = false;
          }, 1000);
          break;
  }
}

window.onkeyup = (e) => { 
  switch (e.code) {
      case "ArrowLeft":
      case "ArrowRight":
      case "ArrowDown":
      case "KeyA":
      case "KeyD":
          clearInterval(interval)
          interval = null
          break;
  }
}


// Gestion des collisions 
Events.on(engine, 'collisionStart', (event) => { 
  event.pairs.forEach(collision => {
    // Frits identiques
    if (collision.bodyA.label ===  collision.bodyB.label) {
      // On laisse les watermelon dans le terrain
      if(collision.bodyA.label === "watermelon") {
        console.log("watermelon")
        return
      }
      World.remove(world, [collision.bodyA, collision.bodyB]) 
      const index = FRUITS.findIndex(fruit => fruit.label === collision.bodyA.label)
      const fusion = FRUITS[index + 1]
      const body = Bodies.circle(collision.collision.supports[0].x, collision.collision.supports[0].y, fusion.radius, {
        render: {fillStyle: fusion.color},
        label: fusion.label,
        restitution: 0.2
      })
      World.add(world, [body])
      score += fusion.score 
      displayScore.innerHTML = score
    }
    if((collision.bodyA.label === "top" || collision.bodyB.label === "top") && !disableAction) {
      if(score > localStorage.getItem("topScore")) {
          localStorage.setItem("topScore", score)
        }
        alert("GAME OVER", score)
        window.location.reload()
      }
    }
  )
})


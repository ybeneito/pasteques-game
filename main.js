import { Engine, Render, Runner, World, Events, Bodies, Body, Sleeping } from "matter-js"
import { AddNewFruit } from "./modules/addNewFruit"
import { getBox } from "./modules/box"
import { FRUITS } from "./modules/fruits"
import {sounds, pop, jump } from "./modules/sounds"

let nextImg = document.getElementById('imgNext')

const resetScore = document.getElementById('resetScore')
let displayScore = document.getElementById('displayScore')
let score = 0
displayScore.innerHTML = score

const displayWatermelons = document.getElementById('displayWatermelons')
let watermelons = 0
displayWatermelons.innerHTML = watermelons

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

// Utilisation des sons
sounds()


// Gestion des 2 premiers fruits
let [currentFruit, nextFruit] = AddNewFruit()
nextImg.setAttribute("src", `/${nextFruit.label}.png`)
World.add(world, currentFruit)


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
            let currentRadius = (currentFruit.vertices[0].x - currentFruit.vertices[9].x) / 2
              if((currentFruit.position.x + (currentRadius/2)) > (60 + currentRadius))
              Body.setPosition(currentFruit, {
                  x: currentFruit.position.x - 2,
                  y: currentFruit.position.y
              })
          }, 5);
          break;

      case "ArrowRight":
      case "KeyD":
          if(interval) return;
          interval = setInterval(() => {
            let currentRadius = (currentFruit.vertices[0].x - currentFruit.vertices[9].x) / 2
              if((currentFruit.position.x + (currentRadius/2)) < 560)
              Body.setPosition(currentFruit, {
                  x: currentFruit.position.x + 2,
                  y: currentFruit.position.y
              })
          }, 5);
          break;

      case "ArrowDown":
      case "Space":
          disableAction = true;
          Sleeping.set(currentFruit, false)
          jump.play()
          setTimeout(() => {
              World.remove(world, nextFruit)
              let currentPair = AddNewFruit(nextFruit)
              currentFruit = currentPair[0]
              nextFruit = currentPair[1]
              nextImg.setAttribute("src", `/${nextFruit.label}.png`)
              World.add(world, [currentFruit])
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
      case "Space":
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
      pop.play()
      // On retire les watermelon du terrain
      if(collision.bodyA.label === "watermelon") {
        const index = FRUITS.findIndex(fruit => fruit.label === collision.bodyA.label)
        const watermelon = FRUITS[index]
        displayScore += watermelon.score
        watermelon += 1
        World.remove(world, [collision.bodyA, collision.bodyB])
        return;
      } else {
        World.remove(world, [collision.bodyA, collision.bodyB]) 
        const index = FRUITS.findIndex(fruit => fruit.label === collision.bodyA.label)
        const fusion = FRUITS[index + 1]
        const body = Bodies.circle(collision.collision.supports[0].x, collision.collision.supports[0].y, fusion.radius, {
          render: {
            fillStyle: fusion.color,
            sprite: {
              texture: `/${fusion.label}.png`,
              xScale: fusion.radius / 115 ,
              yScale: fusion.radius / 115
            }
          },
          label: fusion.label,
          restitution: 0.2
        })
        World.add(world, [body])
        score += fusion.score 
        displayScore.innerHTML = score
      }
  }

    if((collision.bodyA.label === "top" || collision.bodyB.label === "top") && !disableAction) {
      let record = false
      if(score > localStorage.getItem("topScore")) {
          localStorage.setItem("topScore", score)
          record = true
        }
        record ? alert(`GAME OVER ---Record Battu--- score: ${score}`) : alert(`GAME OVER score: ${score}`)
        window.location.reload()
      }
    }
  )
})

// Si bug de topScore possibilité de l'éffacer 
resetScore.addEventListener("click", () => { 
  localStorage.setItem("topScore", 0)
  window.location.reload()
})




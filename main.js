import { Engine, Render, Runner, World, Composite, Events, Bodies, Body, Sleeping } from "matter-js"
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
let disableAction = false
let gameOver = false

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
window.addEventListener('keydown', (e) => {
  if(disableAction) return;

  switch (e.code) {

      case "ArrowLeft":
      case "KeyA":
          if(interval) return;
          interval = setInterval(() => {
            const currentRadius = currentFruit.circleRadius
              if((currentFruit.position.x - currentRadius) > 60)
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
            const currentRadius = currentFruit.circleRadius
              if((currentFruit.position.x + currentRadius) < 560)
              Body.setPosition(currentFruit, {
                  x: currentFruit.position.x + 2,
                  y: currentFruit.position.y
              })
          }, 5);
          break;

      case "ArrowDown":
      case "Space":
          disableAction = true;
          currentFruit.collisionFilter = { category: 0x0001, mask: 0xFFFFFFFF, group: 0 }
          Sleeping.set(currentFruit, false)
          jump.play()
          setTimeout(() => {
              let currentPair = AddNewFruit(nextFruit)
              currentFruit = currentPair[0]
              nextFruit = currentPair[1]
              nextImg.setAttribute("src", `/${nextFruit.label}.png`)
              World.add(world, [currentFruit])
              disableAction = false;
          }, 1000);
          break;
  }
})

window.addEventListener('keyup', (e) => {
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
})


// Gestion des collisions 
Events.on(engine, 'collisionStart', (event) => { 
  event.pairs.forEach(collision => {
    // Frits identiques
    if (collision.bodyA.label ===  collision.bodyB.label) {
      pop.play()
      // On retire les watermelon du terrain
      if(collision.bodyA.label === "watermelon") {
        const index = FRUITS.findIndex(fruit => fruit.label === collision.bodyA.label)
        const watermelonFruit = FRUITS[index]
        score += watermelonFruit.score
        displayScore.innerHTML = score
        watermelons += 1
        displayWatermelons.innerHTML = watermelons
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

    }
  )
})

resetScore.addEventListener("click", () => {
  localStorage.setItem("topScore", 0)
  window.location.reload()
})

document.getElementById('gameOverRestart').addEventListener("click", () => {
  window.location.reload()
})


const TOP_LINE_Y = 150

Events.on(engine, 'afterUpdate', () => {
  if (gameOver || disableAction) return

  const bodies = Composite.allBodies(engine.world)
  for (const body of bodies) {
    if (body.isStatic || body === currentFruit) continue
    if (body.position.y - body.circleRadius < TOP_LINE_Y) {
      gameOver = true
      const isRecord = score > localStorage.getItem("topScore")
      if (isRecord) localStorage.setItem("topScore", score)

      document.getElementById('gameOverScore').textContent = score
      if (isRecord) document.getElementById('gameOverRecord').classList.remove('hidden')
      document.getElementById('gameOverOverlay').classList.remove('hidden')
      break
    }
  }
})





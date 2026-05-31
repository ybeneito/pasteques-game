import { World } from "matter-js"
import { AddNewFruit } from "./modules/addNewFruit"
import { getBox } from "./modules/box"
import { sounds } from "./modules/sounds"
import { createRenderer } from "./modules/renderer"
import { setupControls } from "./modules/controls"
import { setupCollisions } from "./modules/collisions"
import { setupGameOver } from "./modules/gameOver"

const { engine, world } = createRenderer(document.getElementById('app'))

getBox(world)
sounds()

const [currentFruit, nextFruit] = AddNewFruit()
World.add(world, currentFruit)

const state = {
  currentFruit,
  nextFruit,
  score: 0,
  watermelons: 0,
  interval: null,
  disableAction: false,
  gameOver: false,
  nextImg: document.getElementById('imgNext'),
  displayScore: document.getElementById('displayScore'),
  displayWatermelons: document.getElementById('displayWatermelons'),
}

state.nextImg.setAttribute("src", `/${nextFruit.label}.png`)
state.displayScore.innerHTML = state.score
state.displayWatermelons.innerHTML = state.watermelons
document.getElementById('displayTopScore').innerHTML = localStorage.getItem("topScore") || 0

setupControls(state, world)
setupCollisions(state, engine, world)
setupGameOver(state, engine)

document.getElementById('resetScore').addEventListener("click", () => {
  localStorage.setItem("topScore", 0)
  window.location.reload()
})

document.getElementById('gameOverRestart').addEventListener("click", () => {
  window.location.reload()
})

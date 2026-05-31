import { Body, Sleeping, World } from "matter-js"
import { AddNewFruit } from "./addNewFruit"
import { jump } from "./sounds"

export const setupControls = (state, world) => {
  window.addEventListener('keydown', (e) => {
    if (state.disableAction) return

    switch (e.code) {
      case "ArrowLeft":
      case "KeyA":
        if (state.interval) return
        state.interval = setInterval(() => {
          const currentRadius = state.currentFruit.circleRadius
          if ((state.currentFruit.position.x - currentRadius) > 60)
            Body.setPosition(state.currentFruit, {
              x: state.currentFruit.position.x - 2,
              y: state.currentFruit.position.y
            })
        }, 5)
        break

      case "ArrowRight":
      case "KeyD":
        if (state.interval) return
        state.interval = setInterval(() => {
          const currentRadius = state.currentFruit.circleRadius
          if ((state.currentFruit.position.x + currentRadius) < 560)
            Body.setPosition(state.currentFruit, {
              x: state.currentFruit.position.x + 2,
              y: state.currentFruit.position.y
            })
        }, 5)
        break

      case "ArrowDown":
      case "Space":
        state.disableAction = true
        state.currentFruit.collisionFilter = { category: 0x0001, mask: 0xFFFFFFFF, group: 0 }
        Sleeping.set(state.currentFruit, false)
        jump.play()
        setTimeout(() => {
          const [newCurrent, newNext] = AddNewFruit(state.nextFruit)
          state.currentFruit = newCurrent
          state.nextFruit = newNext
          state.nextImg.setAttribute("src", `/${newNext.label}.png`)
          World.add(world, [newCurrent])
          state.disableAction = false
        }, 1000)
        break
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
        clearInterval(state.interval)
        state.interval = null
        break
    }
  })
}

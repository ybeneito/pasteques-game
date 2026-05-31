import { Events, Bodies, World } from "matter-js"
import { FRUITS } from "./fruits"
import { pop } from "./sounds"

export const setupCollisions = (state, engine, world) => {
  Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(collision => {
      if (collision.bodyA.label !== collision.bodyB.label) return

      pop.play()

      if (collision.bodyA.label === "watermelon") {
        const watermelonFruit = FRUITS.find(fruit => fruit.label === "watermelon")
        state.score += watermelonFruit.score
        state.displayScore.innerHTML = state.score
        state.watermelons += 1
        state.displayWatermelons.innerHTML = state.watermelons
        World.remove(world, [collision.bodyA, collision.bodyB])
        return
      }

      World.remove(world, [collision.bodyA, collision.bodyB])
      const index = FRUITS.findIndex(fruit => fruit.label === collision.bodyA.label)
      const fusion = FRUITS[index + 1]
      const body = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        fusion.radius,
        {
          label: fusion.label,
          restitution: 0.2,
          render: {
            fillStyle: fusion.color,
            sprite: {
              texture: `/${fusion.label}.png`,
              xScale: fusion.radius / 115,
              yScale: fusion.radius / 115
            }
          }
        }
      )
      World.add(world, [body])
      state.score += fusion.score
      state.displayScore.innerHTML = state.score
    })
  })
}

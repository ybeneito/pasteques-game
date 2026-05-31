import { Events, Composite } from "matter-js"

const TOP_LINE_Y = 150

export const setupGameOver = (state, engine) => {
  Events.on(engine, 'afterUpdate', () => {
    if (state.gameOver || state.disableAction) return

    const bodies = Composite.allBodies(engine.world)
    for (const body of bodies) {
      if (body.isStatic || body === state.currentFruit) continue
      if (body.position.y - body.circleRadius < TOP_LINE_Y) {
        state.gameOver = true
        const isRecord = state.score > localStorage.getItem("topScore")
        if (isRecord) localStorage.setItem("topScore", state.score)

        document.getElementById('gameOverScore').textContent = state.score
        if (isRecord) document.getElementById('gameOverRecord').classList.remove('hidden')
        document.getElementById('gameOverOverlay').classList.remove('hidden')
        break
      }
    }
  })
}

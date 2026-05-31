import { Engine, Render, Runner } from "matter-js"

export const createRenderer = (appElement) => {
  const engine = Engine.create()
  const render = Render.create({
    element: appElement,
    engine,
    options: {
      width: 620,
      height: 840,
      wireframes: false,
      background: '#B1F1CB'
    }
  })
  const runner = Runner.create()

  Render.run(render)
  Runner.run(runner, engine)

  return { engine, world: engine.world }
}

import { Bodies } from "matter-js"
import { FRUITS } from "./fruits"

export const AddNewFruit = (current) => {
  let rdmIndex = Math.floor(Math.random() * 5)
  // Permet de ne pas avoir 2 fois le même fruit et de rappeler récursivement AddNewFruit
    let f = FRUITS[rdmIndex]

    if(current.label === f.label) {
      AddNewFruit(current)
    }

    const fruit = Bodies.circle(300,50, f.radius, {
        label: f.label,
        isSleeping: true,
        render: {
          fillStyle: f.color,
          sprite: {
            texture: `/${f.label}.png`,
            xScale: f.radius / 100,
            yScale: f.radius / 100
          }
        },
        restitution: 0.2
      })

    return fruit
}
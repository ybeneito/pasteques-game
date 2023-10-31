import { Bodies } from "matter-js"
import { FRUITS } from "./fruits"

export const AddNewFruit = (current) => {
  let rdmIndex = Math.floor(Math.random() * 5)
  let f = FRUITS[rdmIndex]
  let fruit
    // Permet de ne pas avoir 2 fois le même fruit et de rappeler récursivement AddNewFruit
    if(current.label === f.label) {

      return AddNewFruit(current)
    } else {

      fruit = Bodies.circle(300,50, f.radius, {
        label: f.label,
        isSleeping: true,
        render: {
          fillStyle: f.color,
          sprite: {
            texture: `/${f.label}.png`,
            xScale: (f.radius - 5) / 100 ,
            yScale: (f.radius - 5) / 100
          }
        },
        restitution: 0.2
      })
    }
    return fruit
}
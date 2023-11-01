import { Bodies } from "matter-js"
import { FRUITS } from "./fruits"

const base = Bodies.circle(0,0,0, {
  isStatic: true,
  label: "base",
  render: {
    fillStyle: '#000000',
  }
})

export const AddNewFruit = (old = base) => {
  let newFruit, newNext, f, fNew

  // Première paire de fruit
  if(old.label === base.label) {
    let rdmIndex = Math.floor(Math.random() * 5)
    let rdmIndexNext = Math.floor(Math.random() * 5)
    if(rdmIndex === rdmIndexNext) {
      return AddNewFruit(old)
    }
    f = FRUITS[rdmIndex]
    newFruit = Bodies.circle(300,50, f.radius, {
      label: f.label,
      isSleeping: true,
      render: {
        fillStyle: f.color,
        sprite: {
          texture: `/${f.label}.png`,
          xScale: f.radius / 115 ,
          yScale: f.radius / 115
        }
      },
      restitution: 0.2
    }
  )

  fNew = FRUITS[rdmIndexNext]
  newNext = Bodies.circle(20,20,20, {
    label: fNew.label,
    isSleeping: true,
    render: {
      fillStyle: fNew.color,
      sprite: {
        texture: `/${fNew.label}.png`,
        xScale: 20 / 100 ,
        yScale: 20 / 100
      }
    }
  })
  } else {
    // Les autres
    const index = FRUITS.findIndex(fruit => fruit.label === old.label)
    let nF = FRUITS[index]
    newFruit = Bodies.circle(300,50, nF.radius, {
      label: nF.label,
      isSleeping: true,
      render: {
        fillStyle: nF.color,
        sprite: {
          texture: `/${nF.label}.png`,
          xScale: nF.radius / 115 ,
          yScale: nF.radius / 115
        }
      },
      restitution: 0.2
    })

    let randomIndex = Math.floor(Math.random() * 5)
    let nN = FRUITS[randomIndex]  
    newNext = Bodies.circle(20,20,20, {
      label: nN.label,
      isSleeping: true,
      render: {
        fillStyle: nN.color,
        sprite: {
          texture: `/${nN.label}.png`,
          xScale: 20 / 100 ,
          yScale: 20 / 100
        }
      }
    })
  }
    return [newFruit, newNext]
}

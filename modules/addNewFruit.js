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

const base = Bodies.circle(0,0,0, {
  isStatic: true,
  label: "base",
  render: {
    fillStyle: '#000000',
  }
})

export const AddNewFruit2 = (old = base) => {
  console.log("addNew2 old: ", old.label)
  console.log('addNew2 base: ', base.label)
  let newFruit, newNext, f, fNew
  if(old.label === base.label) {
    console.log("2 fruits demandés")
    let rdmIndex = Math.floor(Math.random() * 5)
    let rdmIndexNext = Math.floor(Math.random() * 5)
    if(rdmIndex === rdmIndexNext) {
      console.log("rerun")
      return AddNewFruit2(old)
    }
    f = FRUITS[rdmIndex]
    newFruit = Bodies.circle(300,50, f.radius, {
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
    }
  )

  fNew = FRUITS[rdmIndexNext]
  newNext = Bodies.circle(15,15,15, {
    label: fNew.label,
    isSleeping: true,
    render: {
      fillStyle: fNew.color,
      sprite: {
        texture: `/${fNew.label}.png`,
        xScale: (15 - 5) / 100 ,
        yScale: (15 - 5) / 100
      }
    }
  })
  } else {
    console.log("1 fruit demandé: ", old)
    const index = FRUITS.findIndex(fruit => fruit.label === old.label)
    let nF = FRUITS[index]
    console.log("newFruit: ", nF)
    newFruit = Bodies.circle(300,50, nF.radius, {
      label: nF.label,
      isSleeping: true,
      render: {
        fillStyle: nF.color,
        sprite: {
          texture: `/${nF.label}.png`,
          xScale: (nF.radius - 5) / 100 ,
          yScale: (nF.radius - 5) / 100
        }
      },
      restitution: 0.2
    })

    let randomIndex = Math.floor(Math.random() * 5)
    let nN = FRUITS[randomIndex]  
    newNext = Bodies.circle(15,15,15, {
      label: nN.label,
      isSleeping: true,
      render: {
        fillStyle: nN.color,
        sprite: {
          texture: `/${nN.label}.png`,
          xScale: (15 - 5) / 100 ,
          yScale: (15 - 5) / 100
        }
      }
    })
  }
  console.log("newNext: ", newNext)
    return [newFruit, newNext]
}

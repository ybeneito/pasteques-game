import {Bodies, World} from "matter-js"

export const getBox = (world) => { 

    const top = Bodies.rectangle(310,150,620,2, {
      isStatic: true,
      isSensor: true,
      render: {fillStyle: '#113B29'},
      label: "top",
    })
    const ground = Bodies.rectangle(310, 820, 620, 60, {
        isStatic: true,
        render: {fillStyle: '#30A46C'}
      }
      );
      
      const leftWall = Bodies.rectangle(15,395,30,790, {
        isStatic: true,
        render: {fillStyle: '#30A46C'}
      }) 
      
      const rightWall = Bodies.rectangle(605,395,30,790, {
        isStatic: true,
        render: {fillStyle: '#30A46C'}
      })
      
      const box = [top, ground, leftWall, rightWall]

      World.add(world, box)
}




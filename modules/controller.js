import { Body, Sleeping, World } from "matter-js";
import { AddNewFruit } from "./addNewFruit";

export const useControll = (currentFruit, world) => {
    // L'interval permet de modifier le comportement de déplacement du fruit
    let interval = null
    // Permet de définir si l'utilisateur à le droit de jouer le fruit
    let disableAction = false

    // Gestion des inputs utilisateur qd et flèches pour gauche/droite espace/flèche du bas pour lacer le fruit
    window.onkeydown = (e) => {
        if(disableAction) return;

        switch (e.code) {

            case "ArrowLeft":
            case "KeyA":
                if(interval) return;
                interval = setInterval(() => {
                    if(currentFruit.position.x - 20 > 30)
                    Body.setPosition(currentFruit, {
                        x: currentFruit.position.x - 1,
                        y: currentFruit.position.y
                    })
                }, 5);
                break;

            case "ArrowRight":
            case "KeyD":
                if(interval) return;
                interval = setInterval(() => {
                    if(currentFruit.position.x + 20 < 590)
                    Body.setPosition(currentFruit, {
                        x: currentFruit.position.x + 1,
                        y: currentFruit.position.y
                    })
                }, 5);
                break;

            case "ArrowDown":
            case "Space":
                disableAction = true;
                Sleeping.set(currentFruit, false)
                setTimeout(() => {
                    currentFruit = AddNewFruit(currentFruit)
                    World.add(world, currentFruit)
                    disableAction = false;
                }, 1000);
                break;
        }
    }

    window.onkeyup = (e) => { 
        switch (e.code) {
            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowDown":
            case "KeyA":
            case "KeyD":
                clearInterval(interval)
                interval = null
                break;
        }
    }
}
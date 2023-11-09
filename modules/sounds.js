import {Howl, Howler} from 'howler'

export const pop = new Howl({
    src: "./test1.wav"
})
  
export const jump = new Howl({
    src: "./test2.wav"
})

export const sounds = () => {
      Howler.volume(0.3)
      
      let volumeInput = document.getElementById('volume')
      volumeInput.value = 30
      volumeInput.addEventListener('change', () => {
        Howler.volume(volumeInput.value /100)
      })
}

import React from 'react'
import * as Tone from 'tone'

interface PlaySoundParams {
  playbackRate?: number
}

class GambaSound {
  player = new Tone.Player
  ready = false
  private url?: string

  constructor(url: string) {
    this.url = url
    this.player.load(url)
      .then((x) => {
        this.ready = x.loaded
        this.player.toDestination()
      })
      .catch((err) => console.error('Failed to load audio', err))
  }

  play({ playbackRate = 1 }: PlaySoundParams = {}) {
    try {
      this.player.playbackRate = playbackRate
      this.player.start()
    } catch (err) {
      console.warn('Failed to play sound', this.url, err)
    }
  }
}

export function useSounds<T extends {[s: string]: string}>(definition: T) {
  const sources = Object.keys(definition)

  const sounds = React.useMemo(
    () =>
      Object
        .entries(definition)
        .map(([id, url]) => {
          const sound = new GambaSound(url)
          return { id, sound }
        })
        .reduce((prev, { id, sound }) => ({
          ...prev,
          [id]: sound,
        }), {} as Record<keyof T, GambaSound>)
    ,
    [...sources],
  )

  return sounds
}

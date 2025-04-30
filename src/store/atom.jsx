import { atom } from "jotai"

export const artworksAtom = atom(async () => {
  const res = await fetch("/xr/meisterwerke-neu.json")
  const data = await res.json()
  return data
})

export const currentModalAtom = atom({})

import { useEffect, useRef, useState } from "react"
import { useAtom } from "jotai"

import Scene from "./components/Scene"

import { artworksAtom } from "./store/atom"
import { fetchData } from "./utils/fetchData"

function filterBestOfArtworks(artworks) {
  if (!Array.isArray(artworks)) {
    console.error("Expected an array of artworks")
    return []
  }

  return artworks.filter((artwork) => artwork.isBestOf === true)
}

function App() {
  const [artworksData, setArtWorksData] = useAtom(artworksAtom)

  // https://lucascranach.org/data-proxy/image.php
  // ?subpath=
  // /DE_KSVC_M165_FR338C
  // /01_Overall
  // /DE_KSVC_M165_FR338C
  // _2010-09_Overall-m.jpg

  useEffect(() => {
    ;(async () => {
      const data = await fetchData(
        import.meta.env.VITE_API_URL,
        import.meta.env.VITE_API_LOGIN,
        import.meta.env.VITE_API_PASSWORD
      )
      const bestOfArtworks = filterBestOfArtworks(data)
      setArtWorksData(bestOfArtworks)
      // console.log(bestOfArtworks)
    })()
  }, [])

  return <>{<Scene />}</>
}

export default App

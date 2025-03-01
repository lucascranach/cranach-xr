import { useEffect, useRef, useState } from "react"
import { useAtom } from "jotai"
import Scene from "./components/Scene"
import { fetchData } from "./utils/fetchData"
import { dataAtom } from "./store/atom"

function App() {
  const [results, setResults] = useAtom(dataAtom)

  useEffect(() => {
    ;(async () => {
      const data = await fetchData(
        import.meta.env.VITE_API_URL,
        import.meta.env.VITE_API_LOGIN,
        import.meta.env.VITE_API_PASSWORD
      )
      setResults(data.data.results)
    })()
  }, [])

  return (
    <>
      <Scene />
    </>
  )
}

export default App

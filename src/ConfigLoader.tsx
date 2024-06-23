import { FC, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { ConfigAtom } from './atoms/config'

export const ConfigLoader: FC = () => {
  const config = useAtomValue(ConfigAtom)

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(config))
  }, [config])

  return <></>
}

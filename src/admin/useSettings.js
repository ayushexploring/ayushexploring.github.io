import { useCallback, useState } from 'react'

const KEY = 'av-admin-settings'

// The token stays in this browser's localStorage and is sent only to
// api.github.com. Nothing is bundled into the deployed site.
const EMPTY = {
  owner: '',
  repo: '',
  branch: 'main',
  path: 'src/data/content.json',
  token: '',
}

function read() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return { ...EMPTY }
  }
}

export default function useSettings() {
  const [settings, setSettingsState] = useState(read)

  const setSettings = useCallback((next) => {
    setSettingsState(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(KEY)
    setSettingsState({ ...EMPTY })
  }, [])

  const configured = Boolean(settings.owner && settings.repo && settings.token && settings.path)

  return { settings, setSettings, clear, configured }
}

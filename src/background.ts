import { defineBackground } from 'wxt/utils/define-background'

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async () => {
    const defaults: Record<string, unknown> = {
      theme: 'dark',
      ledgerEnabled: true,
      accentColor: '#10b981',
    }
    const result = await chrome.storage.sync.get(Object.keys(defaults))
    const missing = Object.entries(defaults).filter(([key]) => !(key in result))
    if (missing.length > 0) {
      await chrome.storage.sync.set(Object.fromEntries(missing))
    }
  })
})

import { reactive, computed } from 'vue'
import { useConfig } from './config'

const state = reactive({
  theme: 'light',
  themes: ['light', 'dark'],
  keys: [
    'background-color',
    'background-darker-color',
    'border-color',
    'font-color',
  ]
})

export function useTheme() {
  const { config, saveConfig } = useConfig()

  const setTheme = (theme) => { 
    for (const key of state.keys) {
      const themeKey = `--${theme}-${key}`
      const newValue = getComputedStyle(document.documentElement).getPropertyValue(themeKey).trim();
      if (!newValue) {
        continue
      }

      const globalKey = `--${key}`
      document.documentElement.style.setProperty(globalKey, newValue);
    }

    state.theme = theme
    
    config.theme = theme
    saveConfig()
  }

  return {
    themes: computed(() => state.themes),
    theme: computed(() => state.theme),
    setTheme
  }
}

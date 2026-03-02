import { createContext } from "react"

// Types and Initial State (Non-Components)
export type Theme = "dark" | "light" | "system"

export type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

// Export the Context
export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
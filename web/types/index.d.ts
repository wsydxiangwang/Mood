import { ColorModeInstance } from "./color-mode"

declare module '@nuxt/types' {
  interface Context {
    $colorMode: ColorModeInstance
  }
}
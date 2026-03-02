// Breakpoints
export const MOBILE_BREAKPOINT = 1024

// Taskbar
export const TASKBAR_HEIGHT = 48

// Animation durations (ms)
export const ANIMATION = {
  BAR_ENTER_DELAY: 150,
  BAR_ENTER_ARTIST_OFFSET: 80,
  ARTIST_BAR_TRIGGER: 200,
  TRANSITION_DURATION: 700,
  AI_THINK_DELAY: 400,
  COPY_RESET_DELAY: 2000,
  TOAST_TIMEOUT: 3500,
  BOOT_FADE_OUT: 2900,
  BOOT_COMPLETE: 3500,
  TERMINAL_WELCOME_FIRST: 200,
  TERMINAL_WELCOME_SUBSEQUENT: 400,
} as const

// macOS traffic light colors
export const TRAFFIC_LIGHTS = {
  close: { bg: "#ff5f57", border: "#e0443e", text: "#820005" },
  minimize: { bg: "#febc2e", border: "#d4a017", text: "#7d4e00" },
  maximize: { bg: "#28c840", border: "#1da030", text: "#0a4300" },
} as const

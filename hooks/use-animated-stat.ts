import { useState, useEffect } from "react"

/** Returns a fake animated stat that fluctuates around a base value. */
export function useAnimatedStat(base: number, variance: number, interval: number) {
  const [value, setValue] = useState(base)
  useEffect(() => {
    const timer = setInterval(() => {
      setValue(Math.min(99, Math.max(5, base + Math.round((Math.random() - 0.5) * variance * 2))))
    }, interval)
    return () => clearInterval(timer)
  }, [base, variance, interval])
  return value
}

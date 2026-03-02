/**
 * Web Audio API sound synthesis — no audio files needed.
 */

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
    if (!ctx) {
        ctx = new (
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
    }
    if (ctx.state === "suspended") ctx.resume()
    return ctx
}

/**
 * Authentic mechanical keyboard click (Cherry MX Blue-style).
 *
 * Two layers:
 *  1. Click transient — sharp band-passed noise burst (the "click" you hear)
 *  2. Bottom-out thud — low sine decay (the key hitting the plate)
 */
export function playKeyClick() {
    try {
        const ac = getCtx()
        const now = ac.currentTime

        // ── Layer 1: Click transient (band-passed noise) ──────────────────────
        const bufLen = Math.floor(ac.sampleRate * 0.02) // 20ms noise buffer
        const buf = ac.createBuffer(1, bufLen, ac.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) {
            data[i] = Math.random() * 2 - 1
        }

        const noiseSrc = ac.createBufferSource()
        noiseSrc.buffer = buf

        // Band-pass centred around 3kHz — gives the classic MX Blue "click" character
        const bp = ac.createBiquadFilter()
        bp.type = "bandpass"
        bp.frequency.value = 3000
        bp.Q.value = 0.8

        // High-pass to remove rumble
        const hp = ac.createBiquadFilter()
        hp.type = "highpass"
        hp.frequency.value = 1500

        const clickGain = ac.createGain()
        clickGain.gain.setValueAtTime(0.55, now)
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018)

        noiseSrc.connect(bp)
        bp.connect(hp)
        hp.connect(clickGain)
        clickGain.connect(ac.destination)
        noiseSrc.start(now)
        noiseSrc.stop(now + 0.02)

        // ── Layer 2: Bottom-out thud (short sine decay) ───────────────────────
        const thudOsc = ac.createOscillator()
        thudOsc.type = "sine"
        thudOsc.frequency.setValueAtTime(180, now + 0.008)
        thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.045)

        const thudGain = ac.createGain()
        thudGain.gain.setValueAtTime(0.0, now)
        thudGain.gain.setValueAtTime(0.18, now + 0.008)     // slight delay after click
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

        thudOsc.connect(thudGain)
        thudGain.connect(ac.destination)
        thudOsc.start(now)
        thudOsc.stop(now + 0.07)

    } catch {
        /* silently ignore if audio context unavailable */
    }
}

/**
 * Window open/close snap — soft low "pop", like a macOS popover.
 */
export function playWindowSnap() {
    try {
        const ac = getCtx()
        const now = ac.currentTime

        const osc = ac.createOscillator()
        osc.type = "sine"
        osc.frequency.setValueAtTime(260, now)
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06)

        const gain = ac.createGain()
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

        const osc2 = ac.createOscillator()
        osc2.type = "sine"
        osc2.frequency.setValueAtTime(1200, now)

        const gain2 = ac.createGain()
        gain2.gain.setValueAtTime(0.03, now)
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

        osc.connect(gain)
        osc2.connect(gain2)
        gain.connect(ac.destination)
        gain2.connect(ac.destination)

        osc.start(now)
        osc.stop(now + 0.08)
        osc2.start(now)
        osc2.stop(now + 0.04)
    } catch {
        /* silently ignore */
    }
}

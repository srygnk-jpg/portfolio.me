const CLIENT_ID = "ced63883d83e4e0e88943cfde229e7f8"
const CLIENT_SECRET = "f67793547c5b4c6faeeac17a437c94e0"
const REFRESH_TOKEN = "AQDhvxjnCyGe-kS3LU3Gp9E3NVzteXRtnEWeiQE7yOgFp3kAQ_dnDR7GqymWqfWcNXbg3mrQFkXcmFVMeor3WkinmQHSkfz1hjhz5IjRfZhFITnmJeORMZJDwpMZ3yWO5KE"

export interface NowPlayingData {
  isPlaying: boolean
  title: string
  artist: string
  albumArt?: string
}

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  })
  const data = await res.json()
  return data.access_token
}

export async function fetchNowPlaying(): Promise<NowPlayingData | null> {
  try {
    const token = await getAccessToken()
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status !== 200) return null
    const data = await res.json()
    if (!data?.item) return null
    return {
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
      albumArt: data.item.album?.images?.[2]?.url ?? data.item.album?.images?.[0]?.url,
    }
  } catch {
    return null
  }
}

export async function spotifyNowPlayingText(): Promise<string> {
  try {
    const token = await getAccessToken()
    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status !== 200) return "♪ Nothing playing right now."
    const data = await res.json()
    if (!data?.item) return "♪ Nothing playing right now."
    const title = data.item.name
    const artists = data.item.artists.map((a: { name: string }) => a.name).join(", ")
    const album = data.item.album.name
    return `♪ Now Playing\n  Track  : ${title}\n  Artist : ${artists}\n  Album  : ${album}`
  } catch {
    return "✗ Could not reach Spotify."
  }
}

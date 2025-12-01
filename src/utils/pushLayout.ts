export type LayoutElement = {
  id: string
  type: 'text' | 'image' | 'button'
  position: { x: number; y: number }
  size: { width: number; height: number }
  content: string
  style?: Record<string, any>
}

export type HUDLayout = {
  id: string
  elements: LayoutElement[]
}

export async function pushLayout(layout: HUDLayout, url?: string) {
  const endpoint = url || (typeof window !== 'undefined' && localStorage.getItem('mentra.push.url')) || 'http://localhost:8787/broadcast/layout'
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ layout })
  })
  if (!res.ok) throw new Error('Push failed')
  return res.json()
}


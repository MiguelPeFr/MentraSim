import React, { useEffect, useState } from 'react'
import { pushLayout } from '../utils/pushLayout'

const PushLayoutPanel: React.FC = () => {
  const [url, setUrl] = useState<string>(() => (typeof window !== 'undefined' && localStorage.getItem('mentra.push.url')) || 'http://localhost:8787/broadcast/layout')
  const [customJson, setCustomJson] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('mentra.push.url', url)
  }, [url])

  const sendRecorder = async () => {
    setSending(true)
    setStatus('')
    try {
      await pushLayout({ id: 'recorder', elements: [{ id: 'title', type: 'text', position: { x: 40, y: 40 }, size: { width: 720, height: 48 }, content: 'Recording...', style: { fontSize: '22px', color: '#ffffff', textAlign: 'center' } }] }, url)
      setStatus('OK')
    } catch (e) {
      setStatus('Error')
    } finally {
      setSending(false)
    }
  }

  const sendTranslation = async () => {
    setSending(true)
    setStatus('')
    try {
      await pushLayout({ id: 'translation', elements: [{ id: 'src', type: 'text', position: { x: 40, y: 60 }, size: { width: 720, height: 32 }, content: 'Hola', style: { fontSize: '18px', color: '#ffffff' } }, { id: 'dst', type: 'text', position: { x: 40, y: 110 }, size: { width: 720, height: 32 }, content: 'Hello', style: { fontSize: '18px', color: '#22c55e' } }] }, url)
      setStatus('OK')
    } catch (e) {
      setStatus('Error')
    } finally {
      setSending(false)
    }
  }

  const sendCamera = async () => {
    setSending(true)
    setStatus('')
    try {
      await pushLayout({ id: 'camera', elements: [{ id: 'photo', type: 'image', position: { x: 160, y: 100 }, size: { width: 480, height: 270 }, content: 'https://dummyimage.com/480x270/0a0a0a/ffffff&text=Photo' }] }, url)
      setStatus('OK')
    } catch (e) {
      setStatus('Error')
    } finally {
      setSending(false)
    }
  }

  const sendCustom = async () => {
    setSending(true)
    setStatus('')
    try {
      const parsed = JSON.parse(customJson)
      await pushLayout(parsed, url)
      setStatus('OK')
    } catch (e) {
      setStatus('Error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Push Layout</h3>
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">Endpoint</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mentra-500" placeholder="http://localhost:8787/broadcast/layout" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button onClick={sendRecorder} disabled={sending} className="bg-mentra-600 hover:bg-mentra-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">Recorder</button>
        <button onClick={sendTranslation} disabled={sending} className="bg-mentra-600 hover:bg-mentra-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">Translation</button>
        <button onClick={sendCamera} disabled={sending} className="bg-mentra-600 hover:bg-mentra-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">Camera</button>
      </div>
      <div className="mt-4">
        <label className="block text-white text-sm font-medium mb-2">Custom JSON HUDLayout</label>
        <textarea value={customJson} onChange={(e) => setCustomJson(e.target.value)} className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mentra-500 h-32" placeholder='{"id":"test","elements":[{"id":"t","type":"text","position":{"x":40,"y":40},"size":{"width":720,"height":48},"content":"Hola HUD"}]}' />
        <div className="mt-3 flex justify-end">
          <button onClick={sendCustom} disabled={sending} className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg">Enviar JSON</button>
        </div>
      </div>
      {status && (<div className="mt-3 text-xs text-gray-300">{status}</div>)}
    </div>
  )
}

export default PushLayoutPanel


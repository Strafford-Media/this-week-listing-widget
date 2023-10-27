import React from 'react'
import { createRoot } from 'react-dom/client'
import { DudaContextValue } from './@types/duda'
import { App } from './components/App'
import { DudaProvider } from './DudaContext'
// @ts-ignore
import cssText from 'bundle-text:./tailwind.css'

if (process.env.NODE_ENV !== 'development') {
  // inject <style> tag
  let style = document.createElement('style')
  style.textContent = cssText
  document.head.appendChild(style)
}

let root
export function init({
  container,
  props,
}: {
  container: Element
  props: DudaContextValue
}) {
  if (container) {
    root = createRoot(container)

    root.render(
      <DudaProvider value={props}>
        <App />
      </DudaProvider>
    )
  }
}

export function clean() {
  if (root) {
    root.unmount()
  }
}

if (process.env.NODE_ENV === 'development') {
  const root = createRoot(document.getElementById('app')!)

  root.render(
    <DudaProvider
      value={{
        siteDetails: {
          device: 'desktop',
          page: 'home',
          inEditor: true,
          accountId: '29a2c5ba8b6949a0bf32212853cc4ac5',
          siteId: '948efe8a',
          widgetId: 'a9486149096146debe5387df3e73b6f8',
          widgetVersion: '-1',
          elementId: '1789939675',
          config: {},
          locale: 'en',
        },
      }}
    >
      <App />
    </DudaProvider>
  )
}

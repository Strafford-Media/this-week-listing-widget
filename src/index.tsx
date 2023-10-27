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
export async function init({
  container,
  props,
}: {
  container: Element
  props: DudaContextValue
}) {
  if (container) {
    root = createRoot(container)

    if (typeof (window as any).dmAPI === 'undefined') {
      return console.error(
        'no dmAPI object available to bootstrap widget content'
      )
    }

    const dp = (window as any).dmAPI.dynamicPageApi()

    if (!dp.isDynamicPage()) return console.error('not on a dynamic page')

    props.pageData = await dp.pageData()

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
        pageData: {
          business_name: 'Aloha Adventures',
          images: [
            {
              url: 'https://irt-cdn.multiscreensite.com/3105c6ea9c524f6482a10797a4aa680a/dms3rep/multi/Cat_August_2010-4-b3e1cbd3.jpg',
              status: 'UPLOADED',
              original_url:
                'https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg',
            },
          ],
          island: 'oahu',
          primary_address: '1234 Beach Blvd, Honolulu, HI',
          created_at: '',
          description:
            "Experience the thrill of surfing on the beautiful shores of Oahu. Our expert instructors will have you riding the waves in no time. Book your adventure today and discover the magic of the Pacific Ocean. Whether you're a beginner or an experienced surfer, our friendly team is here to make your surfing dreams come true. Join us for a memorable day on the water and ride the waves of Aloha!",
          videos: [
            {
              url: 'https://www.youtube.com/watch?v=ik2Z1IZPJZ8',
            },
          ],
          booking_links: [],
          primary_phone: '808-555-1234',
          updated_at: '',
          tier: 'basic',
          primary_email: 'info@alohaadventures.com',
          id: 1,
          slogan: 'Catch the Wave of Fun!',
          primary_web_url: 'https://www.alohaadventures.com',
        },
      }}
    >
      <App />
    </DudaProvider>
  )
}

import type { AppProps } from 'next/app'
import '../src/design-system/styles/main.scss'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

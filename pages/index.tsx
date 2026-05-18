import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1>Hello World</h1>
    </main>
  )
}

export default Home

import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import HowItWorksNew from '../_saved-sections/banner-endless-works'

const Roadmap = dynamic(() => import('../_saved-sections/roadmap'), { ssr: false })

const Home: NextPage = () => {
  return (
    <main>
      <HowItWorksNew />
      <Roadmap />
    </main>
  )
}

export default Home

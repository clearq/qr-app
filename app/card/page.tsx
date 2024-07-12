// pages/index.tsx
import type { NextPage } from 'next'
import CardForm from '@/components/CardForm'

const Home: NextPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Card</h1>
      <CardForm />
    </div>
  )
}

export default Home

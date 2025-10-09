import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <h1 className="text-6xl font-bold text-black font-sans">
        DevCoach AI
      </h1>
    </div>
  )
}
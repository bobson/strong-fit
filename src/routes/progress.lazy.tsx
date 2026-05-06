import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/progress')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/progress"!</div>
}

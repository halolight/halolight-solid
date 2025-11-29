import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense, onMount } from 'solid-js'
import './app.css'
import { runBasicTests } from './test-functions'

export default function App() {
  onMount(() => {
    // 运行基本测试
    if (import.meta.env.DEV) {
      runBasicTests()
    }
  })

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Halolight Solid</Title>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}

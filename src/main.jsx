import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import GlobalStyles from './styles/GlobalStyles'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,           // 실패 시 1번만 재시도
      staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    },
  },
})

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <GlobalStyles />
    <App />
  </QueryClientProvider>
)
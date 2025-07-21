import Layout from './components/Layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
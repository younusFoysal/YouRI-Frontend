import {AuthProvider,} from './context/AuthContext';
import AppRoutes from "./routes/AppRoutes.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemedToaster} from "./utils/ThemedToaster.tsx";


const queryClient = new QueryClient()

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <AppRoutes />
            <ThemedToaster />
        </AuthProvider>
      </QueryClientProvider>
  );
}

export default App;
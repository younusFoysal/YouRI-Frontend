import {AuthProvider,} from './context/AuthContext';
import AppRoutes from "./routes/AppRoutes.tsx";




function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
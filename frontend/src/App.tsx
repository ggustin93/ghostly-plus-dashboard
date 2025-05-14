import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { RouterProvider } from '@/routes/router';
import { AuthProvider } from '@/contexts/auth-context';
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <RouterProvider />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
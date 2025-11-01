import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from './store/store';
import { MiniPlayer } from '@/components/shared';
import {NotFound,CookPage,Recipes,RecipeBuilder} from '@/pages'

const queryClient = new QueryClient();

// Layout component that contains routes and mini player
const AppLayout = () => (
  <>
    <Routes>
      <Route path="/" element={<Navigate to="/recipes" replace />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/create" element={<RecipeBuilder />} />
      <Route path="/cook/:id" element={<CookPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <MiniPlayer />
  </>
);

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;

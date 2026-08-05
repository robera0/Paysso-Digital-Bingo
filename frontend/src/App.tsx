import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Main from "../components/Main";
import Game from "../pages/Game";
import BingoTickets from "../pages/ticket";
import Login from "../pages/Login";
const queryClient = new QueryClient();
export const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/game" element={<Main />}>
              <Route index element={<Game />} />
              <Route path="ticket" element={<BingoTickets />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
};

export default App;

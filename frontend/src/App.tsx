import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Main from "../components/Main";
import Game from "../pages/Game";
import BingoTickets from "../pages/ticket";
import Login from "../pages/Login";
const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.25 },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    {...pageTransition}
    className="min-h-screen"
    style={{ width: "100%" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/game"
          element={
            <PageWrapper>
              <Main />
            </PageWrapper>
          }
        >
          <Route
            index
            element={
              <PageWrapper>
                <Game />
              </PageWrapper>
            }
          />
          <Route
            path="ticket"
            element={
              <PageWrapper>
                <BingoTickets />
              </PageWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster position="top-right" richColors />
          <AnimatedRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
};

export default App;

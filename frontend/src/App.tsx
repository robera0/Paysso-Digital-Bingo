import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import Main from "../components/Main";
import Game from "../pages/Game";
import BingoTickets from "../pages/ticket";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp.tsx";
import Account from "../pages/Account";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "./AuthProvider.tsx";
import AdminApp from "./Admin/AdminApp";
const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as const },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    {...pageTransition}
    className="min-h-screen w-full"
    style={{ width: "100%", willChange: "opacity" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AuthProvider>
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
            path="/admin"
            element={
              <PageWrapper>
                <AdminApp />
              </PageWrapper>
            }
          />

          <Route
            path="/signup"
            element={
              <PageWrapper>
                <SignUp />
              </PageWrapper>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <Main />
                </PageWrapper>
              </ProtectedRoute>
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
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </AuthProvider>
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

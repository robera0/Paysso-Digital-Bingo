import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer selectedCount={0} active={""} setActive={() => ""} />
      </div>
    </div>
  );
};

export default Main;

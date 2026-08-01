import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer selectedCount={0} active={""} setActive={() => ""} />
    </div>
  );
};

export default Main;

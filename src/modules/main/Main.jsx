import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

const Main = () => {
  const [ShowMenu, setShowMenu] = useState(true);
  const [ShowHeader, setShowHeader] = useState(false);
  const [ActivePath, setActivePath] = useState("");
  const [ActivePage, setActivePage] = useState("");
  const [screenSize, getDimension] = useState(window.innerWidth);

  // const [foo, setFoo] = useState('test');
  const initMenu = () => setShowMenu(!ShowMenu);
  const setDimension = () => getDimension(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", setDimension);
    setShowMenu(screenSize < 640 ? false : true);
    setShowHeader(screenSize < 640 ? true : false);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  const IsActiveMenu = (path, page) => {
    setActivePath(path);
    setActivePage(page);
  };

  return (
    <div className="relative flex w-full min-h-screen bg-background text-normal text-sm">
      {ShowHeader && <Header setShowMenu={initMenu} />}
      {/* <Sidebar ShowMenu={ShowMenu} ActiveMenu={IsActiveMenu} /> */}
      {ShowMenu && <Sidebar ActiveMenu={IsActiveMenu} />}
        <main className="workspace">
          {/* <section className="breadcrumb lg:flex items-start">
                    <Breadcrumb path={ActivePath} page={ActivePage} />
                    <Panel/>
                </section> */}
          <Outlet context={[ActivePath, ActivePage]} />
          {/* <Footer /> */}
        </main>
    </div>
  );
};

export default Main;

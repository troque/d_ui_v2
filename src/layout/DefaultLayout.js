import React, { useState, useEffect } from "react";
import RoutesPersoneria from './../components/RoutesPersoneria';
import NavbarSidebar from './NavbarSidebar';
import NavbarHeader from './NavbarHeader';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken, getUser, removeUserSession, setUserSession } from '../components/Utils/Common';


const DefaultLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserAuth, setIsUserAuth] = useState(false);

  useEffect(() => {
    const validUser = getUser() != null;
    setIsUserAuth(validUser);
    if (location.pathname != "/Login" && !validUser) {
      removeUserSession();
      navigate("/Login");
    }
    if (location.pathname == "/Login" && validUser)
      navigate("/");
  }, [location, navigate]);

  return (
    <div id="page-container" className={isUserAuth ? "sidebar-o enable-page-overlay side-scroll page-header-fixed page-header-dark main-content-narrow" : "side-trans-enabled"}>
      {isUserAuth ? <NavbarSidebar /> : null}
      {isUserAuth ? <NavbarHeader /> : null}
      <main id="main-container">
        <div id="div-content" className="content">
          <RoutesPersoneria />
        </div>
      </main>
      {isUserAuth ? <Footer /> : null}
    </div>
  )
}

export default DefaultLayout

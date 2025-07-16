import React, { Fragment } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Routers from "../../routers/Routers";
import Navbar from "../Navbar/Navbar";

const Layout = () => {
  return (
    <Fragment>
      <Navbar />
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
    </Fragment>
 
  );
};

export default Layout;

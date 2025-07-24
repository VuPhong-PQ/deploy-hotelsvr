import React, { useRef, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ModalAuthentication from "../ModalAuthentication";
import "../../styles/header.css";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/blogs",
    display: "Blog",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const { userCurrent, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState('login');

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const handleOpenModal = (status) => {
    setModalStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      {/* ============ header top ============ */}
      <div className="header__top">
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__left">
                <span>Need Help?</span>
                <span className="header__top__help">
                  <i class="ri-phone-fill"></i> +84 2976 279 999
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6">
              <div className="header__top__right d-flex align-items-center justify-content-end gap-3">
                {!userCurrent ? (
                  <>
                    <button 
                      className="header__login-btn"
                      onClick={() => handleOpenModal('login')}
                    >
                      <i className="ri-login-circle-line"></i> Login
                    </button>
                    <button 
                      className="header__register-btn"
                      onClick={() => handleOpenModal('register')}
                    >
                      <i className="ri-user-add-line"></i> Register
                    </button>
                  </>
                ) : (
                  <div className="header__user-info d-flex align-items-center gap-2">
                    <span>Welcome, {userCurrent.firstName} {userCurrent.lastName}</span>
                    <button 
                      className="header__logout-btn"
                      onClick={handleLogout}
                    >
                      <i className="ri-logout-circle-line"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* =============== header middle =========== */}
      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="4" md="3" sm="4">
              <div className="logo">
                <h1>
                  <Link to="/home" className=" d-flex align-items-center gap-2">
                  <i class="ri-hotel-fill"></i>
                    <span>
                    Hotel Service <br /> BWP Sonasea Phu Quoc
                    </span>
                  </Link>
                </h1>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i class="ri-earth-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Duong Bao</h4>
                  <h6>Phu Quoc City, Viet Nam</h6>
                </div>
              </div>
            </Col>

            <Col lg="3" md="3" sm="4">
              <div className="header__location d-flex align-items-center gap-2">
                <span>
                  <i class="ri-time-line"></i>
                </span>
                <div className="header__location-content">
                  <h4>Every Time You Need</h4>
                  <h6>24 / 24</h6>
                </div>
              </div>
            </Col>

            <Col
              lg="2"
              md="3"
              sm="0"
              className=" d-flex align-items-center justify-content-end "
            >
              <button className="header__btn btn ">
                <Link to="/contact">
                  <i class="ri-phone-line"></i> Request a call
                </Link>
              </button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* ========== main navigation =========== */}

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i class="ri-menu-line" onClick={toggleMenu}></i>
            </span>

            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
                    key={index}
                  >
                    {item.display}
                  </NavLink>
                ))}
                {userCurrent && (
                      <>
                        <NavLink
                          to="/create-blog"
                          className="nav__item"
                        >
                          Create Post
                        </NavLink>
                        <NavLink
                          to="/my-blogs"
                          className="nav__item"
                        >
                          My Posts
                        </NavLink>
                        {userCurrent.role === 'Admin' && (
                          <NavLink
                            to="/admin"
                            className="nav__item admin__link"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '25px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              border: '2px solid transparent',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <i className="ri-admin-line"></i>
                            Admin
                          </NavLink>
                        )}
                      </>
                    )}
              </div>
            </div>

            <div className="nav__right">
              <div className="search__box">
                <input type="text" placeholder="Search" />
                <span>
                  <i class="ri-search-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <ModalAuthentication 
        open={isModalOpen}
        handleCloseModal={handleCloseModal}
        status={modalStatus}
      />
    </header>
  );
};

export default Header;
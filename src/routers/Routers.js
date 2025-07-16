import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Listing from "../pages/Listing";
import Details from "../pages/Details";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import NotFound from "../pages/NotFound";
import Contact from "../pages/Contact";
import ReservationConfirmation from "../pages/ReservationConfirmation"; // Import trang xác nhận

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Listing />} />
      <Route path="/services/:slug" element={<Details />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/reserve" element={<ReservationConfirmation />} /> {/* Thêm route cho trang xác nhận */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
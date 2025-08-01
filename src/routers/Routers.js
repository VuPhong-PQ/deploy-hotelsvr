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
import ReservationConfirmation from "../pages/ReservationConfirmation";
import CreateBlog from "../pages/CreateBlog";
import EditBlog from "../pages/EditBlog";
import MyBlogs from "../pages/MyBlogs";
import Services from "../pages/Services";
import AdminDashboard from "../components/Admin/AdminDashboard";

import Booking from "../pages/Booking";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/listing" element={<Listing />} />
      <Route path="/services/:id" element={<Details />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/reservation-confirmation" element={<ReservationConfirmation />} />
      <Route path="/create-blog" element={<CreateBlog />} />
      <Route path="/edit-blog/:id" element={<EditBlog />} />
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
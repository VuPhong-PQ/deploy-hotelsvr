import React from "react";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/item.css";

const Item = (props) => {
  const { imgUrl, model, serviceName, automatic, speed, price } = props.item;

  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="services_item">
        <div className="services_img">
          <img src={imgUrl} alt="" className="w-100" />
        </div>

        <div className="services_item-content mt-4">
          <h4 className="section__title text-center">{serviceName}</h4>
          <h6 className="rent__price text-center mt-">
            ${price}.00 <span>/ Pax</span>
          </h6>

          <div className="services_item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className=" d-flex align-items-center gap-1">
            <i class="ri-restaurant-line"></i> {model}
            </span>
            <span className=" d-flex align-items-center gap-1">
            <i class="ri-goblet-fill"></i> {automatic}
            </span>
            <span className=" d-flex align-items-center gap-1">
              <i class="ri-timer-flash-line"></i> {speed}
            </span>
          </div>

          <button className=" w-50 services_item-btn services_btn-rent">
            <Link to={`/services/${serviceName}`}>Booking</Link>
          </button>

          <button className=" w-50 services_item-btn services__btn-details">
            <Link to={`/services/${serviceName}`}>Details</Link>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default Item;

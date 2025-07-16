import React from "react";
import "../../styles/become.css";
import { Container, Row, Col } from "reactstrap";

import driverImg from "../../assets/all-images/img2.png";

const BecomeSection = () => {
  return (
    <section className="become__resert">
      <Container>
        <Row>
          <Col lg="6" md="6" sm="12" className="become__resert-img">
            <img src={driverImg} alt="" className="w-100" />
          </Col>

          <Col lg="6" md="6" sm="12">
            <h2 className="section__title become__resert-title">
            Don't miss our best services
            </h2>

            <button className="btn become__resert-btn mt-4">
            Reserve Now
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BecomeSection;

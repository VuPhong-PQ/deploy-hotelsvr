import React from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import Item from "../components/UI/Item";
import servicesData from "../assets/data/servicesData";

const Listing = () => {
  return (
    <Helmet title="Services">
      <CommonSection title="Services Listing" />

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className=" d-flex align-items-center gap-3 mb-5">
                <span className=" d-flex align-items-center gap-2">
                  <i class="ri-sort-asc"></i> Sort By
                </span>

                <select>
                  <option>Select</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
              </div>
            </Col>

            {servicesData.map((item) => (
              <Item item={item} key={item.id} />
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Listing;

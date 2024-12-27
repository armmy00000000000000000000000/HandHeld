import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar/nav";
import "../pos/pos.css";
import { Tabs, Tab, Row, Col, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import moto from "../image/moto-b.png";
import car from "../image/car-b.png";
import bus from "../image/bus-b.png";

function POS() {
  return (
    <div className="POS">
                      {/* <nav className="navbar navbar-light bg-light">
  <div className="container-fluid">
    <p className="navbar-brand">ชื่อผู้ใช้งาน</p>
    <form className="d-flex">
    <button className="btn btn-outline-success" onClick={handleClick}>
      Monitor 2
    </button>
      <button    onClick={handleLogout} className="btn btn-outline-danger" type="submit">logout</button>
    </form>
  </div>
</nav> */}
      <div className="col-12 col-xl-8">
        <div className="pos_container  px-4">
          <div className="row mt-4 ms-5">
            <div className="col-12 col-md-6 col-xl-8">
              <p className="m-0 p-0">
                <span className="">ผู้ใช้งาน : </span>
                <span className="fw-bold">Arm Addpay</span>
                <span className="ms-3">รหัสผู้ใช้ : </span>
                <span className="fw-bold">addpay0010</span>
              </p>
              <p className="m-0 p-0">
                <span className="">หน้าขาย : </span>
                <span className="fw-bold">สวนสัตว์เปิดเขาเขียว</span>
              </p>
            </div>
            <div className="col-12 col-md-6 col-xl-4 d-flex justify-content-start justify-content-md-end pe-5 mt-3 mt-md-0">
              <Link
                to="/"
                type="button"
                className="m-1 m-xl-2 fw-bold px-1 px-md-2 px-xl-4 btn btn-primary"
              >
                Home
              </Link>
              <Link
                to="/"
                type="button"
                className="m-1 m-xl-2 fw-bold px-1 px-md-2 px-xl-4 btn btn-warning"
              >
                Recheck
              </Link>
              <Link
                to="/"
                type="button"
                className="m-1 m-xl-2 fw-bold px-1 px-md-2 px-xl-4 btn btn-info"
              >
                Report
              </Link>
            </div>
          </div>

          <div className="mb-3">
            <div className="tab-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12">
                    <Tab.Container defaultActiveKey="Zooticket">
                      <Nav
                        variant="pills"
                        className="nav nav-fill navtop btn-group btn-group-justified d-flex justify-content-center mt-4"
                      >
                        <Nav.Item className="m-1">
                          <Nav.Link
                            className="p-3 fw-bold"
                            eventKey="Zooticket"
                            style={{
                              borderRadius: 20,
                              border: "2px dashed blue",
                            }}
                          >
                            บัตรเข้าสวนสัตว์
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item className="m-1">
                          <Nav.Link
                            className="p-3 fw-bold"
                            eventKey="Discount"
                            style={{
                              borderRadius: 20,
                              border: "2px dashed blue",
                            }}
                          >
                            บัตรส่วนลด
                          </Nav.Link>
                        </Nav.Item>

                        <Nav.Item className="m-1">
                          <Nav.Link
                            className="p-3 fw-bold"
                            eventKey="Activity"
                            style={{
                              borderRadius: 20,
                              border: "2px dashed blue",
                            }}
                          >
                            บัตรกิจกรรม
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="m-1">
                          <Nav.Link
                            className="p-3 fw-bold"
                            eventKey="Advance"
                            style={{
                              borderRadius: 20,
                              border: "2px dashed blue",
                            }}
                          >
                            บัตรจำหน่ายล่วงหน้า
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="m-1">
                          <Nav.Link
                            className="p-3 fw-bold"
                            eventKey="Exclusion"
                            style={{
                              borderRadius: 20,
                              border: "2px dashed blue",
                            }}
                          >
                            บัตรกลุ่มได้รับการยกเว้นค่าบัตร
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>

                      <Tab.Content style={{ marginTop: "2em" }}>
                        <Tab.Pane eventKey="Zooticket">
                          <Row>
                            <Col xl={4}>
                              <Row>
                                {/* match */}
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-dark bg-info rounded-3 p-3 shadow-sm"
                                    data-name="ผู้ใหญ่ ชาย"
                                    data-price="200"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder ">
                                        ผู้ใหญ่ ชาย
                                      </p>

                                      <p className="info-box-number mb-0">
                                        200
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-dark bg-info rounded-3 p-3 shadow-sm"
                                    data-name="ผู้ใหญ่ หญิง"
                                    data-price="200"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        ผู้ใหญ่ หญิง
                                      </p>

                                      <p className="info-box-number mb-0">
                                        200
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-dark bg-info rounded-3 p-3 shadow-sm"
                                    data-name="เด็ก ชาย"
                                    data-price="40"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        เด็ก ชาย
                                      </p>

                                      <p className="info-box-number mb-0">40</p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-dark bg-info rounded-3 p-3 shadow-sm"
                                    data-name="เด็ก หญิง"
                                    data-price="40"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        เด็ก หญิง
                                      </p>

                                      <p className="info-box-number mb-0">40</p>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={4}>
                              <Row>
                                {/* match */}
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 p-3 shadow-sm"
                                    data-name="Adult Male"
                                    data-price="350"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder ">
                                        Adult Male
                                      </p>

                                      <p className="info-box-number mb-0">
                                        350
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 p-3 shadow-sm"
                                    data-name="Adult Female"
                                    data-price="350"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        Adult Female
                                      </p>

                                      <p className="info-box-number mb-0">
                                        350
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 p-3 shadow-sm"
                                    data-name="Child Male"
                                    data-price="120"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        Child Male
                                      </p>

                                      <p className="info-box-number mb-0">
                                        120
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 p-3 shadow-sm"
                                    data-name="Child Female"
                                    data-price="120"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        Child Female
                                      </p>

                                      <p className="info-box-number mb-0">
                                        120
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={4} style={{ marginBottom: "1em" }}></Col>
                          </Row>
                          <Row style={{ marginTop: 80 }}>
                            <Col xl={4} style={{ marginBottom: "1em" }}>
                              <div
                                className="info-box bg-warning text-center fw-bold p-1 rounded-3"
                                data-name="รถจักรยานยนต์"
                                data-price="40"
                                data-type="ticket"
                              >
                                <span className="info-box-icon ">
                                  <img
                                    src={moto}
                                    alt="รถจักรยานยนต์"
                                    data-type="ticket"
                                    style={{ height: "100px" }}
                                  />
                                </span>
                                <div className="info-box-content mt-2 bg-white rounded-2 p-2">
                                  <p className="info-box-text mb-0 ">
                                    รถจักรยานยนต์
                                  </p>
                                  <p className="info-box-number mb-0 fw-normal">
                                    40
                                  </p>
                                </div>
                              </div>
                            </Col>
                            <Col xl={4} style={{ marginBottom: "1em" }}>
                              <div
                                className="info-box bg-warning text-center fw-bold p-1 rounded-3"
                                data-name="รถยนต์"
                                data-price="80"
                                data-type="ticket"
                              >
                                <span className="info-box-icon ">
                                  <img
                                    src={car}
                                    alt="รถยนต์"
                                    data-type="ticket"
                                    style={{ height: "100px" }}
                                  />
                                </span>
                                <div className="info-box-content mt-2 bg-white rounded-2 p-2">
                                  <p className="info-box-text mb-0">รถยนต์</p>
                                  <p className="info-box-number mb-0 fw-normal">
                                    80
                                  </p>
                                </div>
                              </div>
                            </Col>
                            <Col xl={4} style={{ marginBottom: "1em" }}>
                              <div
                                className="info-box bg-warning text-center fw-bold p-1 rounded-3"
                                data-name="รถบัส"
                                data-price="100"
                                data-type="ticket"
                              >
                                <span className="info-box-icon ">
                                  <img
                                    src={bus}
                                    alt="รถบัส"
                                    data-type="ticket"
                                    style={{ height: "100px" }}
                                  />
                                </span>
                                <div className="info-box-content mt-2 bg-white rounded-2 p-2">
                                  <p className="info-box-text mb-0">รถบัส</p>
                                  <p className="info-box-number mb-0 fw-normal">
                                    100
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Tab.Pane>

                        <Tab.Pane eventKey="Discount">
                          <Row>
                            <Col xl={4}>
                              <Row>
                                {/* match */}
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 py-3 px-2 shadow-sm"
                                    data-name="สมาชิก AIS ชาย"
                                    data-price="100"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder ">
                                        สมาชิก AIS ชาย
                                      </p>

                                      <p className="info-box-number mb-0">
                                        100
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                                <Col xl={6} style={{ marginBottom: "1em" }}>
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 py-3 px-2 shadow-sm"
                                    data-name="สมาชิก AIS หญิง"
                                    data-price="100"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        สมาชิก AIS หญิง
                                      </p>

                                      <p className="info-box-number mb-0">
                                        100
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col xl={4} style={{ marginBottom: "1em" }}></Col>
                          </Row>
                        </Tab.Pane>

                        <Tab.Pane eventKey="Activity"></Tab.Pane>
                        <Tab.Pane eventKey="Advance"></Tab.Pane>
                        <Tab.Pane eventKey="Exclusion">
                          <Row>
                            <Col xl={4}>
                              <Row>
                                {/* match */}
                                <Col
                                  xl={6}
                                  style={{
                                    marginBottom: "1em",
                                    padding: "0px 5px",
                                  }}
                                >
                                  <div
                                    className="info-box cursor text-dark bg-info rounded-3 px-2 py-3 shadow-sm"
                                    data-name="เด็กอายุต่ำกว่า 3 ปี ชาย"
                                    data-price="0"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder ">
                                        เด็กอายุต่ำกว่า 3 ปี ชาย
                                      </p>
                                      <p className="info-box-number mb-0">0</p>
                                    </div>
                                  </div>
                                </Col>
                                <Col
                                  xl={6}
                                  style={{
                                    marginBottom: "1em",
                                    padding: "0px 5px",
                                  }}
                                >
                                  <div
                                    className="info-box cursor text-dark bg-info rounded-3 px-2 py-3 shadow-sm"
                                    data-name="เด็กอายุต่ำกว่า 3 ปี หญิง"
                                    data-price="0"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder">
                                        เด็กอายุต่ำกว่า 3 ปี หญิง
                                      </p>

                                      <p className="info-box-number mb-0">0</p>
                                    </div>
                                  </div>
                                </Col>
                                
                              </Row>
                            </Col>
                            <Col xl={4}>
                              <Row>
                                {/* match */}
                                <Col
                                  xl={6}
                                  style={{
                                    marginBottom: "1em",
                                    padding: "0px 5px",
                                  }}
                                >
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 px-2 py-3 shadow-sm"
                                    data-name="บัตรหน่วยงานราชการ ชาย"
                                    data-price="0"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text m-0 fw-bolder ">
                                        บัตรหน่วยงานราชการ ชาย
                                      </p>

                                      <p className="info-box-number mb-0">0</p>
                                    </div>
                                  </div>
                                </Col>
                                <Col
                                  xl={6}
                                  style={{
                                    marginBottom: "1em",
                                    padding: "0px 5px",
                                  }}
                                >
                                  <div
                                    className="info-box cursor text-light bg-success rounded-3 px-2 py-3 shadow-sm"
                                    data-name="บัตรหน่วยงานราชการ หญิง"
                                    data-price="0"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text m-0 fw-bolder">
                                        บัตรหน่วยงานราชการ หญิง
                                      </p>

                                      <p className="info-box-number mb-0">0</p>
                                    </div>
                                  </div>
                                </Col>
                                
                              </Row>
                            </Col>
                            <Col xl={4}>
                              <Row>
                                {/* match */}
                                <Col
                                  xl={6}
                                  style={{
                                    marginBottom: "1em",
                                    padding: "0px 5px",
                                  }}
                                >
                                  <div
                                    className="info-box cursor text-light bg-primary rounded-3 px-2 py-3 shadow-sm"
                                    data-name="บัตรสโมสร เยาวชน ชาย"
                                    data-price="0"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder ">
                                        บัตรสโมสร เยาวชน ชาย
                                      </p>

                                      <p className="info-box-number mb-0">0</p>
                                    </div>
                                  </div>
                                </Col>
                                <Col
                                  xl={6}
                                  style={{
                                    marginBottom: "1em",
                                    padding: "0px 5px",
                                  }}
                                >
                                  <div
                                    className="info-box cursor text-light bg-primary rounded-3 px-2 py-3 shadow-sm"
                                    data-name="บัตรสโมสร เยาวชน หญิง"
                                    data-price="0"
                                    data-type="ticket"
                                  >
                                    <div className="info-box-content">
                                      <p className="info-box-text fw-bolder ">
                                        บัตรสโมสร เยาวชน หญิง
                                      </p>

                                      <p className="info-box-number mb-0">0</p>
                                    </div>
                                  </div>
                                </Col>
                                
                              </Row>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: 80 }}>
                            <Col xl={4} style={{ marginBottom: "1em" }}>
                              <div
                                className="info-box bg-warning text-center fw-bold p-1 rounded-3"
                                data-name="รถยนต์สโมสร ครอบครัว"
                                data-price="0"
                                data-type="ticket"
                              >
                                <span className="info-box-icon ">
                                  <img
                                    src={car}
                                    alt="รถยนต์สโมสร ครอบครัว"
                                    data-type="ticket"
                                    style={{ height: "100px" }}
                                  />
                                </span>
                                <div className="info-box-content mt-2 bg-white rounded-2 p-2">
                                  <p className="info-box-text mb-0">
                                    รถยนต์สโมสร ครอบครัว
                                  </p>
                                  <p className="info-box-number mb-0 fw-normal">
                                    0
                                  </p>
                                </div>
                              </div>
                            </Col>
                            <Col xl={4} style={{ marginBottom: "1em" }}>
                              <div
                                className="info-box bg-warning text-center fw-bold p-1 rounded-3"
                                data-name="รถยนต์สโมสร ตลอดชีพ"
                                data-price="0"
                                data-type="ticket"
                              >
                                <span className="info-box-icon ">
                                  <img
                                    src={car}
                                    alt="รถยนต์สโมสร ตลอดชีพ"
                                    data-type="ticket"
                                    style={{ height: "100px" }}
                                  />
                                </span>
                                <div className="info-box-content mt-2 bg-white rounded-2 p-2">
                                  <p className="info-box-text mb-0">
                                    รถยนต์สโมสร ตลอดชีพ
                                  </p>
                                  <p className="info-box-number mb-0 fw-normal">
                                    0
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-xl-4">
        <div className="side_total mt-2">
          <div className="data-list bg-white">
            <div className="card">
              <div className="card-header text-white bg-primary">
                รายการตั๋ว
              </div>
              <div className="card-body">
                <div id="ticket_result"></div>
                <div className="row">
                  <div className="col-md-5">ยอดรวม</div>
                  <div className="p-1 col-md-4">
                    <div className="input-group">
                      <div className="sumtotal">0</div>
                    </div>
                  </div>
                  <div className="text-center col-md-3"> บาท</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-header text-white bg-primary">ชำระเงิน</div>

            <div className="form-group p-3 d-flex justify-content-center">
              <div className="custom-control custom-radio">
                <label className="custom-control-label">
                  <input
                    className="custom-control-input"
                    type="radio"
                    id="payment_methode1"
                    name="payment_method"
                    value="cash"
                    required=""
                  />
                  <div className="front-end box px-3 py-3">
                    <span className="fw-bold">ชำระเงินสด</span>
                  </div>
                </label>
              </div>
              <div className="custom-control custom-radio ms-5">
                <label className="custom-control-label">
                  <input
                    className="custom-control-input"
                    type="radio"
                    id="payment_methode2"
                    name="payment_method"
                    value="qrcode"
                  />
                  <div className="front-end box px-3 py-3">
                    <span className="fw-bold">ชำระผ่าน QR-CODE</span>
                  </div>
                </label>
              </div>
            </div>

            <form action="" method="POST" id="payer_ment">
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-primary px-5 py-2"
                  id="submitButton"
                  disabled=""
                >
                  ชำระเงิน
                </button>
                <button
                  className="btn btn-danger px-5 py-2"
                  id="submitButton"
                  disabled=""
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default POS;

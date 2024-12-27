import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCashRegister,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  return (
    <div className="Sidebar">
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div className="col-6 col-sm-4 col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <ul
                className="nav nav-pills  flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                <div className="mt-3 text-secondary fw-bold ">Dashboard</div>
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-link text-light align-middle py-1 ps-0 text-center text-md-start"
                  >
                    <FontAwesomeIcon icon={faHouse} className="icon" />
                    <span className="ms-0 ms-sm-2 d-block d-sm-inline text-uppercase ">
                      หน้าแรก
                    </span>
                  </Link>
                </li>

                <div className="mt-3 text-secondary fw-bold  ">
                  ระบบขายหน้าร้าน
                </div>
                <li className="nav-item">
                  <Link
                    to="/POS"
                    className="nav-link text-light align-middle py-1 ps-0 text-center text-md-start"
                  >
                    <FontAwesomeIcon icon={faCashRegister} className="icon" />
                    <span className="ms-0 ms-sm-2 d-block d-sm-inline text-uppercase">
                      pos
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Monitor2"
                    target="_blank"
                    className="nav-link text-light align-middle py-1 ps-0 text-center text-md-start"
                  >
                    <FontAwesomeIcon icon={faDesktop} className="icon" />
                    <span className="ms-0 ms-sm-2  d-block d-sm-inline text-uppercase">
                      monitor2
                    </span>
                  </Link>
                </li>
                <div className="mt-3 text-secondary fw-bold  ">ระบบายงาน</div>
                <li className="nav-item">
                  <Link
                    to="/Orderlist"
                    className="nav-link text-light align-middle py-1 ps-0 text-center text-md-start"
                  >
                    <FontAwesomeIcon icon={faCashRegister} className="icon" />
                    <span className="ms-0 ms-sm-2 d-block d-sm-inline text-uppercase">
                      รายการคำสั่งซื้อ
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/ReportBalance"
                    className="nav-link text-light align-middle py-1 ps-0 text-center text-md-start"
                  >
                    <FontAwesomeIcon icon={faDesktop} className="icon" />
                    <span className="ms-0 ms-sm-2 d-block d-sm-inline text-uppercase ">
                      รายงานยอดจำหน่ายบัตร
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

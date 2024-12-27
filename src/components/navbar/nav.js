import React from "react";
import { Link } from 'react-router-dom';
import { API_ENDPOINT } from '../config/config';


function Nav() {
  const handleLogout = () => {
    localStorage.clear();
    // navigate('/login');
    window.location.href = '/handheld/login';
};
const handleClick = () => {
    const empCode = localStorage.getItem('emp_code');
    window.open(`${API_ENDPOINT}/monitor/?bc_chanel=${empCode}`, '_blank');
};
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary shadow-sm"
      aria-label="Thirteenth navbar example "
    >
      <div className="container-fluid">
        <Link to="" className="navbar-brand col-lg-3 me-0 fw-bold">
          ZOO E-Ticket (HandHeld)
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample11"
          aria-controls="navbarsExample11"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse d-lg-flex"
          id="navbarsExample11"
        >
          <ul className="navbar-nav col-lg-9 justify-content-lg-center">
            {/* <li className="nav-item">
              <Link to="/home" className="nav-link active" aria-current="page">
                หน้าแรก
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/order_report" className="nav-link">
                รายงานคำสั่งซื้อ
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to="/ticket_report" className="nav-link">
                รายงานยอดจำหน่ายบัตร
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/handheld" className="nav-link">
              Handheld
              </Link>
            </li>
            {/* <li className="nav-item">
            <Link  onClick={handleClick} className="nav-link">Monitor</Link>
            </li> */}
          </ul>
          <div className="d-lg-flex col-lg-3 justify-content-lg-end">
            <button  onClick={handleLogout} className="btn btn-danger">ออกจากระบบ</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

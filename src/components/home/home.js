import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/nav';
import { API_ENDPOINT } from '../config/config';

function Home() {
  const imgzoos = [
    { id: 1, name: "สวนสัตว์เปิดเขาเขียว" },
    { id: 2, name: "สวนสัตว์เชียงใหม่" },
    { id: 3, name: "สวนสัตว์นครราชสีมา" },
    { id: 4, name: "สวนสัตว์อุบลราชธานี" },
    { id: 5, name: "สวนสัตว์ขอนแก่น" },
    { id: 6, name: "สวนสัตว์สงขลา" },
  ];

  const machineZooId = localStorage.getItem('machine_zoo_id');
  const selectedZoo = imgzoos.find(zoo => zoo.id === parseInt(machineZooId));

  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    const empCode = localStorage.getItem('emp_code');
    window.open(`${API_ENDPOINT}/monitor/?bc_chanel=${empCode}`, '_blank');
  };

  return (
    <div className="Dashboard bg-light vh-100">
      <Navbar />
      <div className="d-flex flex-column flex-md-row">
        <div className="container mt-4 flex-grow-1">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3">
              {isOpen && (
                <div className="accordion shadow rounded" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button bg-primary text-white"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        เมนู {localStorage.getItem('user_role')}
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body bg-white shadow-sm">
                        <ul className="list-group">
                          <li className="list-group-item">
                            <Link to="/home" className="text-decoration-none">หน้าแรก</Link>
                          </li>
                          <li className="list-group-item">
                            <Link to="/order_report" className="text-decoration-none">รายงานประจำวัน</Link>
                          </li>
                          <li className="list-group-item">
                            <Link to="/pos" className="text-decoration-none">POS</Link>
                          </li>
                          <li className="list-group-item">
                            <Link onClick={handleClick} className="text-decoration-none">MONITOR 2</Link>
                          </li>
                          <li className="list-group-item">
                            <Link to="/order_report" className="text-decoration-none">รายงานคำสั่งซื้อ</Link>
                          </li>
                          <li className="list-group-item">
                            <Link to="/ticket_report" className="text-decoration-none">รายงานยอดจำหน่ายบัตร</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <div className="card shadow-lg rounded">
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold">ข้อมูลผู้ใช้งาน</h5>
                  <p><strong>ชื่อผู้ใช้งาน:</strong> {localStorage.getItem('name')}</p>
                  <p><strong>ตำแหน่ง:</strong> {localStorage.getItem('user_role')}</p>
                  <p><strong>ชื่อเครื่อง:</strong> {localStorage.getItem('pc_name') || ''}</p>
                  <p><strong>ประจำสวนสัตว์:</strong> {selectedZoo?.name || localStorage.getItem('zooname') || ''}</p>
                  <p><strong>รหัสเครื่อง:</strong> {localStorage.getItem('emp_code') || ''}</p>
                  <p><strong>API_ENDPOINT:</strong> {API_ENDPOINT || ''}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="alert alert-info shadow-sm rounded">
                  <strong>ประกาศ:</strong> กรุณาตรวจสอบข้อมูลของคุณให้ถูกต้อง
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

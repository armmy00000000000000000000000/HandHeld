import React from 'react'
import { Link } from 'react-router-dom';
import { API_ENDPOINT } from '../config/config';
function Nav() {
    const handleLogout = () => {
        localStorage.clear();

        window.location.href = '/posa/login';
    };
    const handleClick = () => {
        const empCode = localStorage.getItem('emp_code');
        window.open(`${API_ENDPOINT}/monitor/?bc_chanel=${empCode}`, '_blank');
    };
 
  return (
    <div>

        <nav className="navbar navbar-light bg-light mt-2">
                <form className="container-fluid justify-content-center">
                    <Link to='/home' className="btn btn-outline-success me-2" type="button">หน้าแรก</Link>
                    <Link to='/order_report' className="btn btn-outline-success me-2" type="button">รายงานคำสั่งซื้อ</Link>
                    <Link to='/ticket_report' className="btn btn-outline-success me-2" type="button">รายงานยอดจำหน่ายบัตร</Link>
                    <Link to='/pos' className="btn btn-outline-success me-2" type="button">POS</Link>
                    <button  onClick={handleClick} className="btn btn-outline-success me-2" type="button">Monitor</button>
                    <button  onClick={handleLogout} className="btn btn-outline-danger me-2" type="button">ออกจากระบบ</button>
                </form>
            </nav>
    </div>
  )
}

export default Nav

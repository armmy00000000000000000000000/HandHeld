import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/nav';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../config/config';
import Swal from 'sweetalert2';
function Order_report() {
    const [orders, setOrders] = useState([]);
    const [zooname, setZooname] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const ordersPerPage = 20;
    const token = localStorage.getItem('token');
    const user_role = localStorage.getItem('user_role');
    const zooid = localStorage.getItem('user_zoo_id');
    const [selectedZooId, setSelectedZooId] = useState(zooid);
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    const machine = localStorage.getItem('machine') ? JSON.parse(localStorage.getItem('machine')) : {};
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/posa/login';
    };
    useEffect(() => {
        getOrder(selectedZooId);
    }, [selectedZooId]);

    const handleRowClick = (order) => {
        if (order) {
            navigate('/detail_order', { state: { order } });
        } else {
            console.warn('Order data is undefined');
        }
    };

    const getOrder = (zoo) => {
        console.log(`55555555555555555555 ${selectedZooId}`);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", token);

        const raw = JSON.stringify({
            zoo_id: zoo || selectedZooId, // ใช้ selectedZooId ถ้ามี ไม่งั้นใช้ user_zoo_id
            user,
            machine
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/pos/order_report`, requestOptions)
            .then(response => {
                if (response.status === 401) {
                    // แจ้งเตือนให้ผู้ใช้ล็อกเอาท์เมื่อได้รับสถานะ 401
                    Swal.fire({
                        title: 'Token หมดอายุ',
                        text: 'กรุณาเข้าสู่ระบบใหม่',
                        icon: 'warning',
                        confirmButtonText: 'ล็อกเอาท์',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            handleLogout();
                        }
                    });
                    throw new Error('Unauthorized');
                }
                return response.json();
            })
            .then((result) => {
                setOrders(result.orders || []);
                setZooname(result.zoos || []);
                setPageCount(Math.ceil((result.orders ? result.orders.length : 0) / ordersPerPage));
                console.log("Orders fetched:", result.orders);
            })
            .catch((error) => console.error('Fetch error:', error));
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleZooChange = (event) => {
        const value = event.target.value;
        setSelectedZooId(value === "" ? "" : value); // ใช้ค่า "" หากเลือก "ทั้งหมด"
        console.log("Selected Zoo ID:", value);
        setCurrentPage(0); // Reset current page to 0 when selecting a zoo
    };

    const offset = currentPage * ordersPerPage;
    const currentOrders = orders

        .slice(offset, offset + ordersPerPage);

    console.log("Current Orders:", currentOrders);

    return (
        <div>
            <Navbar />
            <div className='container mt-3'>
                <div className="card">
                    <div className="card-header">รายงานคำสั่งซื้อ ( {localStorage.getItem('zooname') || ''} )</div>

                    <div className="card-body">
                        {user_role === 'admin' && (
                            <>
                                <label htmlFor="zoo-select">เลือกสวนสัตว์:</label>
                                <select
                                    id="zoo-select"
                                    className="form-select mb-3"
                                    onChange={handleZooChange}
                                >
                                    <option value="">ทั้งหมด</option>
                                    {zooname.map((zoo) => (
                                        <option key={zoo.id} value={zoo.id}>สวนสัตว์ {zoo.name}</option>
                                    ))}
                                </select>
                            </>
                        )}
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Ref1</th>
                                        {/* <th scope="col">Ref2</th> */}
                                        <th scope="col">ประเภท</th>
                                        <th scope="col">สถานะ</th>
                                        <th scope="col">วันที่ทำรายการ</th>
                                        <th scope="col">ราคาสุทธิ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.length > 0 ? (
                                        currentOrders.map((order, index) => (
                                            <tr key={index} onClick={() => handleRowClick(order)} style={{ cursor: 'pointer' }}>
                                                <th scope="row">{order.id}</th>
                                                <td>{order.ref1}</td>
                                                {/* <td>{order.ref2}</td> */}
                                                <td>{order.payment_method}</td>
                                                <td>{order.status}</td>
                                                <td>{order.create_time}</td>
                                                <td>{order.amount}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">ไม่มีข้อมูล</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <ReactPaginate
                            previousLabel={"ก่อนหน้า"}
                            nextLabel={"ถัดไป"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order_report;

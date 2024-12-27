// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import Navbar from '../navbar/nav';
// function DetailOrder() {
//     const location = useLocation();
//     const { order } = location.state || {}; // Get the order data

//     if (!order) {
//         return <p>No order data available.</p>;
//     }

//     return (
//         <div>
//             <Navbar />

//             <h1>Order Details</h1>
//             <p><strong>ID:</strong> {order.id}</p>
//             <p><strong>Reference 1:</strong> {order.ref1}</p>
//             <p><strong>Reference 2:</strong> {order.ref2}</p>
//             <p><strong>Payment Method:</strong> {order.payment_method}</p>
//             <p><strong>Status:</strong> {order.status}</p>
//             <p><strong>Created At:</strong> {order.created_at}</p>
//             <p><strong>Amount:</strong> {order.amount}</p>
//         </div>
//     );
// }

// export default DetailOrder;

import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/nav';
import zoozpot from "../image/zgetandzoopot.png";
import { useLocation } from 'react-router-dom';
import { API_ENDPOINT, PRINTER_ENDPOINT } from '../config/config';
import Swal from 'sweetalert2';
import './detail.css';

import re from '../image/004.gif'; // นำเข้ารูปภาพ

function DetailOrder() {
    const location = useLocation();
    const { order } = location.state || {};
    const token = localStorage.getItem('token');
    const [orderDetail, setOrderDetail] = useState(null);
    const [orderticket, setOrderticket] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem('user_role');
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('id');
    const machine = localStorage.getItem('machine');
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/posa/login';
    };
    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("X-API-KEY", token);


        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        const orderId = order.id;
        fetch(`${API_ENDPOINT}/api/v1/zoo/pos/report_order_detail/${orderId}`, requestOptions)
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
                console.log(result)
                setOrderDetail(result);
                setOrderticket(result.order.tickets || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                setError(error);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const [printAttempts, setPrintAttempts] = useState(0);

    const Printder = (id, role) => {
        const newAttempt = printAttempts + 1;
        const printUrl = `http://localhost/pos_client_print/${role}.php?id=${id}&r=${newAttempt}&ep=${PRINTER_ENDPOINT}`;
        Reprint("reprint order: " + id, id);
        window.open(printUrl, '_blank', 'width=600,height=400');


        setPrintAttempts(newAttempt);


        alert(`ข้อมูลส่งเรียบร้อยแล้ว กรุณารอ หรือกดปุ่ม ลองอีกครั้ง. จำนวนพิมพ์ซ้ำ (${newAttempt})`);
    };

    const Printder_tid = (id, tid, role) => {
        const newAttempt = printAttempts + 1;
        const printUrl = `http://localhost/pos_client_print/${role}.php?id=${id}&tid=${tid}&r=${newAttempt}&ep=${PRINTER_ENDPOINT}`;

        Reprint("reprint ticket: " + tid + " (order_id: " + id + ")", id);

        window.open(printUrl, '_blank', 'width=600,height=400');


        setPrintAttempts(newAttempt);


        alert(`ข้อมูลส่งเรียบร้อยแล้ว กรุณารอ หรือกดปุ่ม ลองอีกครั้ง. จำนวนพิมพ์ซ้ำ (${newAttempt})`);
    };

    const Reprint = (mge,id_ticket) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "message": mge,
            "id": id_ticket,
            "user_id": user_id
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(API_ENDPOINT + "/api/v1/zoo/public/logs/reprint", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }


    if (loading) {
        return (
            <div className="loading">
                <img width={100} src={re} alt="Loading..." />
                Loading...
            </div>
        );
    }
    if (error) return <p>Error loading order details: {error.message}</p>;
    if (!orderDetail || !orderDetail.order) return <p>No order data available.</p>;
    const groupedTickets = orderticket.reduce((acc, zo) => {
        const ticketName = zo.tickettypes.name; // ชื่อประเภทตั๋ว

        // ถ้ายังไม่มีประเภทตั๋วใน accumulator
        if (!acc[ticketName]) {
            acc[ticketName] = {
                count: 0,
                price: zo.tickettypes.price || 0
            };
        }
        acc[ticketName].count += 1; // เพิ่มจำนวน

        return acc;
    }, {});
    return (
        <div className="OrderlistDetail">
            <Navbar />
            <div className="container-xxl d-flex justify-content-end">
                <p className="fs-5 mt-4 text-center fw-bold">รายละเอียดคำสั่งซื้อ</p>
            </div>
            <div className="container-xxl mt-4">
                <div className="row">
                    <div className="col-md-6 pe-5">
                        <div className="border-bottom border-2">
                            <img src={zoozpot} style={{ height: "100px" }} alt="" />
                            <p className="d-flex justify-content-between mb-0">
                                <span>Ticket Number:</span>
                                <span className="fw-bold">{orderDetail.order.ref1 || 'N/A'}</span>
                            </p>
                            <p className="d-flex justify-content-between">
                                <span>Date Ticket:</span>
                                <span className="fw-bold">{orderDetail.order.create_time || 'N/A'}</span>
                            </p>
                        </div>
                        {/* map item */}
                        <div className="mt-3">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">รายการ</th>
                                        <th scope="col">จำนวน</th>
                                        <th scope="col">ยอดรวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(groupedTickets).map(([ticketName, { count, price }], index) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{ticketName}</td>
                                            <td> {count}</td>
                                            <td>{price * count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tr>
                                    <th scope="col">Total:</th>
                                    <th scope="col"></th>
                                    <th scope="col">{orderticket.reduce((total, zo) => total + (zo.tickettypes.price || 0), 0)}</th>
                                </tr>
                            </table>
                        </div>

                        {/* total */}
                        {/* <div className="mt-3">
                            <p className="d-flex justify-content-between mb-0 p-1 border-bottom border-3">
                                <span className="fw-bold">Total:</span>
                                <span className="fw-bold"> {orderticket.reduce((total, zo) => total + (zo.tickettypes.price || 0), 0)}</span>
                            </p>
                        </div> */}
                    </div>
                    <div className="col-md-6">
                        <div className="card p-3">
                            <div style={{ borderBottom: "1px solid gray" }}>
                                <p className="mb-0">
                                    <span>ผู้รับเงิน/ผู้ทำรายการ:</span>
                                    <span className="ms-3">{orderDetail.order.user.user_profile.first_name} {orderDetail.order.user.user_profile.last_name}</span>
                                </p>
                                <p className="mb-0">
                                    <span>ประจำสวนสัตว์:</span>
                                    <span className="ms-3">{orderDetail.order.machine.zoo.detail}</span>
                                </p>
                                <p className="">
                                    <span>เบอร์โทรศัพท์:</span>
                                    <span className="ms-3">{orderDetail.order.user.user_profile.telephone}</span>
                                </p>
                            </div>
                            <div className="mt-3" style={{ borderBottom: "1px solid gray" }}>
                                <p className="mb-0">
                                    <span>เครื่องที่ทำรายการ:</span>
                                    <span className="ms-3">{orderDetail.order.machine.name}</span>
                                </p>
                                <p className="mb-0">
                                    <span>ประจำสวนสัตว์:</span>
                                    <span className="ms-3">{orderDetail.order.machine.zoo.detail}</span>
                                </p>
                                <p className="mb-0">
                                    <span>รหัสเครื่อง:</span>
                                    <span className="ms-3">{orderDetail.order.machine.code}</span>
                                </p>
                                <p className="mb-0">
                                    <span>หมายเลขเครื่อง:</span>
                                    <span className="ms-3">{orderDetail.order.machine.number}</span>
                                </p>
                                <p className="mb-0">
                                    <span>ไอพี(IP): </span>
                                    <span className="ms-3 text-uppercase">{orderDetail.order.machine.ip}</span>
                                </p>
                                <p className="">
                                    <span>หมายเลขอุปกรณ์(Mac Address):</span>
                                    {/* <span className="ms-3 text-uppercase">{orderDetail.machine.mac}</span> */}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {userRole !== 'staff' && order.status !== 'pending' && order.status !== 'cancel' && (
                    <>
                        <button
                            type="button"
                            className="btn btn-primary p-2 px-3 fw-bold"
                            onClick={() => Printder(order.id, 'index')}
                        >
                            พิมพ์ตั๋วทั้งหมดในรายการ
                        </button>
                        <button
                            type="button"
                            className="btn btn-info p-2 px-3 fw-bold ms-1"
                            onClick={() => Printder(order.id, 'print_group')}
                        >
                            พิมพ์ตั๋วกลุ่ม
                        </button>
                    </>
                )}

                {/* {userRole !== 'staff' && (
                    <>
                        <button
                            type="button"
                            className="btn btn-primary p-2 px-3 fw-bold"
                            onClick={() => Printder(order.id, 'index')}
                        >
                            พิมพ์ตั๋วทั้งหมดในรายการ
                        </button>
                        <button
                            type="button"
                            className="btn btn-info p-2 px-3 fw-bold ms-1"
                            onClick={() => Printder(order.id, 'print_group')}
                        >
                            พิมพ์ตั๋วกลุ่ม
                        </button>
                    </>
                )} */}
            </div>

            <div className="mt-5">
                <div className="card">
                    <div className="card-header fw-bold fs-5 py-3">
                        Ticket Detail Table
                    </div>
                    <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" width="20%">ID</th>
                                    <th scope="col" width="15%" className="text-center">Status</th>
                                    <th scope="col" width="15%">Entry Date</th>
                                    <th scope="col" width="15%">Leave Date</th>
                                    <th scope="col" width="15%">Expire Date</th>
                                    <th scope="col" width="20%" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {orderticket
                                    .filter(zo => zo.tickettypes.obj_type_id !== 2) // Filter out obj_type_id 2
                                    .map((zo, index) => (
                                        <tr key={index}>
                                            <th scope="row">{zo.id}</th>
                                            <td className="text-center">{zo.status}</td>
                                            <td>{zo.entry_date}</td>
                                            <td>{zo.leave_date}</td>
                                            <td>{zo.expire_date}</td>
                                            <td className="text-center">
                                                {/* Print Receipt Button */}
                                                {userRole !== 'staff' && order.status !== 'pending' && order.status !== 'cancel' && (
                                                    <button
                                                        onClick={() => Printder_tid(order.id, zo.id, 'index')}
                                                        type="button"
                                                        className="btn btn-primary py-1"
                                                    >
                                                        พิมพ์ใบเสร็จ
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="card">
                    <div className="card-header fw-bold fs-5 py-3">Car Detail Table</div>
                    <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" width="30%">ID</th>
                                    <th scope="col" width="15%" className="text-center">Status</th>
                                    <th scope="col" width="20%">Gate1</th>
                                    <th scope="col" width="15%">Gate2</th>
                                    <th scope="col" width="20%" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {orderticket
                                    .filter(zo => zo.tickettypes.obj_type_id === 2) // Filter for obj_type_id 2
                                    .map((zo, index) => (
                                        <tr key={index}>
                                            <th scope="row">{zo.id}</th>
                                            <td className="text-center">{zo.status}</td>
                                            <td>{zo.gate1 || "N/A"}</td>
                                            <td>{zo.gate2 || "N/A"}</td>
                                            <td className="text-center">
                                                {/* Print Receipt Button */}
                                                {userRole !== 'staff' && order.status !== 'pending' && order.status !== 'cancel' && (
                                                    <button
                                                        onClick={() => Printder_tid(order.id, zo.id, 'index')}
                                                        type="button"
                                                        className="btn btn-primary py-1"
                                                    >
                                                        พิมพ์ใบเสร็จ
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    </div>
                </div>
            </div>





        </div>

    );
}

export default DetailOrder;

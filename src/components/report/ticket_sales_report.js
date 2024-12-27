import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/nav';
import Swal from 'sweetalert2';
import './detail.css';

import re from '../image/004.gif'; // นำเข้ารูปภาพ

import { API_ENDPOINT, PRINTER_ENDPOINT } from '../config/config';
const Ticket_sales_report = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const [canPrint, setCanPrint] = useState(false); // State สำหรับแสดงปุ่มพิมพ์
    const [reportData, setReportData] = useState(null); // สถานะข้อมูลรายงาน
    const [idprint, setIdprint] = useState(['']); // สถานะข้อมูลรายงาน
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    const machine = localStorage.getItem('machine') ? JSON.parse(localStorage.getItem('machine')) : {};
    const handleLogout = () => {
        localStorage.clear();
        window.location = '/handheld/handheld'
    };
    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", token);
        const raw = JSON.stringify({ user, machine });
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/pos/report_summary_date`, requestOptions)
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
            .then(result => {
                setReportData(result);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        // fetch(`${API_ENDPOINT}/api/v1/pos/public/report_summary_date`, requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         setReportData(result);
        //         setLoading(false);
        //     })
        //     .catch(error => {
        //         setError(error);
        //         setLoading(false);
        //     });
    }, [token]);

    if (loading) {
        return (
            <div className="loading">
                <img width={100} src={re} alt="Loading..." />
                Loading...
            </div>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('th-TH');

    const Printder = (id) => {
        const printUrl = `http://localhost/pos_client_print/printder.php?print_id=${id}&ep=${PRINTER_ENDPOINT}`;
        window.open(printUrl, '_blank', 'width=600,height=400');
    }

    const Print_sum_date = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-API-KEY", token);


        // ตรวจสอบว่ามีข้อมูลใน reportData หรือไม่
        if (!reportData) {
            console.error("reportData is not available");
            return;
        }

        const formattedDate = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = new Date().toLocaleTimeString('th-TH');
        const raw = JSON.stringify({
            "html_content": `
                <div class="receiptSumAll">
                    <table width="100%">
                        <tbody>
                            <tr align="center">
                                <td><b>รายงานยอดจำหน่ายบัตร</b></td>
                            </tr>
                            <tr align="center">
                                <td>${reportData.machine.zoo.name || 'ไม่ระบุ'}</td>
                            </tr>
                            <tr align="center">
                                <td>ประจำวันที่ ${formattedDate}</td>
                            </tr>
                            <tr align="center">
                                <td>รหัสเครื่อง POS: ${reportData.machine.name || 'ไม่ระบุ'}-${reportData.machine.code || 'ไม่ระบุ'}${reportData.machine.number || 'ไม่ระบุ'}</td>
                            </tr>
                            <tr align="center">
                                <td>ชื่อพนักงาน: ${reportData.user_profile.first_name} ${reportData.user_profile.last_name}</td>
                            </tr>
                            <tr align="center">
                                <td>เวลาทำรายการ: ${formattedTime}</td>
                            </tr>
                        </tbody>
                    </table>
                    <b>--------------------------------------------------------------</b><br>
        
                    <table>
                        <tbody>
                            <tr>
                                <td><b>ประเภทบัตร</b></td>
                                <td align="right"><b>ยอดขาย</b></td>
                            </tr>
                        </tbody>
                        <tbody>
                            ${Object.keys(reportData.result).map((key) => {
                                const item = reportData.result[key];
                                const objType = item.obj_type;
                                return `
                                    <tr>
                                        <td align="left">${objType ? objType.name : 'ไม่ระบุ'}</td>
                                        <td align="right"><b>${(item.sum || 0).toLocaleString()}</b></td>
                                    </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                    <br> <b>--------------------------------------------------------------</b><br>
        
                    <table class="table">
                        <tbody>
                            <tr>
                                <td><b>ประเภทรายรับ</b></td>
                                <td align="right"><b>ยอดขาย</b></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr><td align="left">รับเงินโอนผ่าน QR CODE</td><td align="right"><b>${(reportData.paymentMethodSum.qrcode || 0).toLocaleString()}</b></td></tr>
                            <tr><td align="left">รับเงินสด</td><td align="right"><b>${(reportData.paymentMethodSum.cash - reportData.dealer || 0).toLocaleString()}</b></td></tr>
                            <tr><td align="left">บัตรเครดิต</td><td align="right"><b>${(reportData.paymentMethodSum.credit_card || 0).toLocaleString()}</b></td></tr>
                            <tr><td align="left">ขายเชื่อ</td><td align="right"><b>${(reportData.paymentMethodSum.credit || 0).toLocaleString()}</b></td></tr>
                        </tbody>
                    </table>
                    <br> <b>--------------------------------------------------------------</b><br>
        
                    <table class="table">
                        <tbody>
                            <tr>
                                <td><b>รวม</b></td>
                                <td align="right"><b>ยอด</b></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td align="left">รวมเป็นเงิน</td>
                                <td align="right"><b>${(reportData.totalAmount || 0).toLocaleString()}</b></td>
                            </tr>
                            <tr>
                                <td align="left">รวมบัตร(ใบ)</td>
                                <td align="right"><b>${reportData.totalTicketsCount || 0}</b></td>
                            </tr>
                        </tbody>
                    </table>
                    <br> <b>--------------------------------------------------------------</b><br>
        
                    <b style="font-size:1.2em;">[ ]</b> ครบถ้วนถูกต้อง <br>
                    <b style="font-size:1.2em;">[ ]</b> ไม่ถูกต้อง <br>
                    <b>--------------------------------------------------------------</b><br>
        
                    <table>
                        <tbody>
                            <tr align="center">
                                <td><br><b>----------------------------</b> <br><br>
                                    ${reportData.manage_name || ''}<br>
                                    (ผู้ตรวจสอบเงินสด)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>`
        });
        


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`${API_ENDPOINT}/api/v1/zoo/pos/print_summary_date`, requestOptions)
            .then((response) => {
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
                console.log(result.printder.id);
                if (result.status === "success") {
                    setCanPrint(true); // แสดงปุ่มพิมพ์เมื่อสถานะเป็น success
                    setIdprint(result.printder.id);
                } else {
                    setCanPrint(false); // ซ่อนปุ่มพิมพ์เมื่อสถานะไม่เป็น success
                }
            })
            .catch((error) => console.error(error));
    };



    const Print = () => {
   
        const formattedDate = new Date().toLocaleDateString("th-TH");
        const formattedTime = new Date().toLocaleTimeString("th-TH");
    
    
        const printContent = `
            <div class="receiptSumAll">
                <table width="100%">
                    <tbody>
                        <tr align="center">
                            <td><b>รายงานยอดจำหน่ายบัตร</b></td>
                        </tr>
                        <tr align="center">
                            <td>${reportData.machine.zoo.name || "ไม่ระบุ"}</td>
                        </tr>
                        <tr align="center">
                            <td>ประจำวันที่ ${formattedDate}</td>
                        </tr>
                        <tr align="center">
                            <td>รหัสเครื่อง POS: ${reportData.machine.name || "ไม่ระบุ"}-${reportData.machine.code || "ไม่ระบุ"}${reportData.machine.number || "ไม่ระบุ"}</td>
                        </tr>
                        <tr align="center">
                            <td>ชื่อพนักงาน: ${reportData.user_profile.first_name} ${reportData.user_profile.last_name}</td>
                        </tr>
                        <tr align="center">
                            <td>เวลาทำรายการ: ${formattedTime}</td>
                        </tr>
                    </tbody>
                </table>
                <b>-----------------------------------------------------------</b><br>
    
                <table>
                    <tbody>
                        <tr>
                            <td><b>ประเภทบัตร</b></td>
                            <td align="right"><b>ยอดขาย</b></td>
                        </tr>
                    </tbody>
                    <tbody>
                        ${Object.keys(reportData.result)
                            .map((key) => {
                                const item = reportData.result[key];
                                const objType = item.obj_type;
                                return `
                                    <tr>
                                        <td align="left">${objType ? objType.name : "ไม่ระบุ"}</td>
                                        <td align="right"><b>${(item.sum || 0).toLocaleString()}</b></td>
                                    </tr>`;
                            })
                            .join("")}
                    </tbody>
                </table>
                <br> <b>-----------------------------------------------------------</b><br>
    
                <table>
                    <tbody>
                        <tr>
                            <td><b>ประเภทรายรับ</b></td>
                            <td align="right"><b>ยอดขาย</b></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td align="left">รับเงินโอนผ่าน QR CODE</td>
                            <td align="right"><b>${(reportData.paymentMethodSum.qrcode || 0).toLocaleString()}</b></td>
                        </tr>
                        <tr>
                            <td align="left">รับเงินสด</td>
                            <td align="right"><b>${(reportData.paymentMethodSum.cash || 0).toLocaleString()}</b></td>
                        </tr>
                        <tr>
                            <td align="left">บัตรเครดิต</td>
                            <td align="right"><b>${(reportData.paymentMethodSum.credit_card || 0).toLocaleString()}</b></td>
                        </tr>
                        <tr>
                            <td align="left">ขายเชื่อ</td>
                            <td align="right"><b>${(reportData.paymentMethodSum.credit || 0).toLocaleString()}</b></td>
                        </tr>
                    </tbody>
                </table>
                <br> <b>-----------------------------------------------------------</b><br>
    
                <table>
                    <tbody>
                        <tr>
                            <td><b>รวม</b></td>
                            <td align="right"><b>ยอด</b></td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td align="left">รวมเป็นเงิน</td>
                            <td align="right"><b>${(reportData.totalAmount || 0).toLocaleString()}</b></td>
                        </tr>
                        <tr>
                            <td align="left">รวมบัตร(ใบ)</td>
                            <td align="right"><b>${reportData.totalTicketsCount || 0}</b></td>
                        </tr>
                    </tbody>
                </table>
                <br> <b>-----------------------------------------------------------</b><br>
    
                <b style="font-size:1.2em;">[ ]</b> ครบถ้วนถูกต้อง <br>
                <b style="font-size:1.2em;">[ ]</b> ไม่ถูกต้อง <br>
                <b>-----------------------------------------------------------</b><br>
    
                <table>
                    <tbody>
                        <tr align="center">
                            <td><br><b>-------------------------</b> <br><br>
                                ${reportData.manage_name || ""}
                                <br>
                                (ผู้ตรวจสอบเงินสด)
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>`;
    
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        @page {
                            size: 80mm auto; /* กำหนดขนาดกระดาษ */
                            margin: 5mm;
                        }
                        body {
                            font-family: 'Arial', sans-serif;
                            margin: 0;
                            padding: 0;
                            width: 80mm; /* กำหนดความกว้าง */
                            color: #333;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
    
        printWindow.document.close();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000);
        };
    

    };
    


    return (
        <div>
            <Navbar />
            <div className="container mt-3">
                <div className='row'>
                    <div className='col-md-6 card'>
                        <div className='container text-center'>
                            <h5>รายงานยอดจำหน่ายบัตร</h5>
                            <h6>{reportData.machine?.zoo?.name || 'ไม่ระบุ'}</h6>
                            <h6>ประจำวันที่ {formattedDate}</h6>
                            <h6>รหัสเครื่อง POS: {reportData.machine.name || 'ไม่ระบุ'}-{reportData.machine.code || 'ไม่ระบุ'}{reportData.machine.number || 'ไม่ระบุ'}</h6>
                            <h6>ชื่อพนักงาน: {reportData.user_profile.first_name} {reportData.user_profile.last_name}</h6>
                            <h6>เวลาทำรายการ: {formattedTime}</h6>
                        </div>
                        <hr />

                        <h5>ประเภทบัตร</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ประเภทบัตร</th>
                                    <th>ยอดขาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(reportData.result).map((key, index) => {
                                    const item = reportData.result[key];
                                    const objType = item.obj_type;

                                    return (
                                        <tr key={index}> {/* ใช้ index เป็น key ถ้าคีย์ใน result เป็นสตริง JSON */}
                                            <td>
                                                {objType ? objType.name : 'ไม่ระบุ'} {/* แสดงชื่อ */}
                                            </td>
                                            <td>
                                                {item.sum ? item.sum.toLocaleString() : 0} {/* แสดงยอดรวม */}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>


                        </table>

                        <hr />
                        <h5>ประเภทรายรับ</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ประเภท</th>
                                    <th>ยอดขาย</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>รับเงินโอนผ่าน QR CODE</td>

                                    <td>{(reportData.paymentMethodSum.qrcode || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>รับเงินสด</td>

                                    <td>{(reportData.paymentMethodSum.cash - reportData.dealer || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>บัตรเครดิต</td>
                                    <td>{(reportData.paymentMethodSum.credit_card || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>ขายเชื่อ</td>
                                    <td>{(reportData.paymentMethodSum.credit || 0).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                        <div className='row'>
                            <div className='col-md-6'>
                                <h5>รวม</h5>
                                <p>รวมเป็นเงิน: {reportData.totalAmount.toLocaleString() || 0}</p>
                                <p>รวมบัตร(ใบ): {reportData.totalTicketsCount || 0}</p>

                            </div>
                            <div className='col-md-6'>
                                <h5>ตรวจสอบ:</h5>
                                <label>
                                    [] ครบถ้วนถูกต้อง
                                </label>
                                <br />
                                <label>
                                    [] ไม่ถูกต้อง
                                </label>
                            </div>
                        </div>



                        <hr />
                        <p>{reportData.manage_name}</p>
                        <p>(ผู้ตรวจสอบเงินสด)</p>
                    </div>
                    <div className='col-md-6'><div class="dropdown">

                        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={Print_sum_date} >สร้างรายงาน</button>
                        {canPrint && <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() =>Print()}>พิมพ์รายงาน</button>}
                    </div></div>
                </div>
            </div>
        </div>
    );
};

export default Ticket_sales_report;



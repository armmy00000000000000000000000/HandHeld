import React, { useState } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINT, PRINTER_ENDPOINT } from '../config/config';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import QRCode from "react-qr-code";
import zoozpot from "../image/zgetandzoopot.png";
import addpay from "../image/addpay.png";
function CashPage() {
    const location = useLocation();
    const { ticketSummary } = location.state || {}; // Access the passed data
    const [odid, setOdid] = useState(null);
    const [idPrint, setidPrint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isProcessing, setisProcessing] = useState(false);
    const [loadingbtn, setLoadingbtn] = useState(false);
    const [Ref1, setRef1] = useState('');
    const [Ref2, setRef2] = useState('');
    const [Order, setOrder] = useState('');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    const machine = localStorage.getItem('machine') ? JSON.parse(localStorage.getItem('machine')) : {};
    const machine_id = localStorage.getItem('machine_id');
    const [Ioall, setIoall] = useState('');
    const [DateTicket, setDateTicket] = useState(''); // ตัวแปรเก็บหน้าต่างพิมพ์
    const [CheckPrint, setCheckPrint] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false); // สำหรับควบคุมการแสดงผลของปุ่ม
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/handheld/login';
    };

    const [showUI, setShowUI] = useState(false); // state สำหรับควบคุมการแสดง UI
    const [isPrinting, setIsPrinting] = useState(false); // state สำหรับแสดงสถานะการพิมพ์
    const [isPrinted, setIsPrinted] = useState(false); // state สำหรับแสดงปุ่ม "ทำรายการใหม่"

    const handlePrint = async (isGroupPrint, idprint) => {
        // if (isPrinting) {
        //     console.log('กำลังพิมพ์อยู่ กรุณารอสักครู่');
        //     return;
        // }
        console.log(ticketSummary)
        if (isProcessing) return;
        setisProcessing(true)
        setLoadingbtn(true);
        const summaryToPrint = { ...ticketSummary };

        setIsConfirmed(true); // เมื่อยืนยันแล้ว ให้ซ่อนปุ่ม
        // ตั้งสถานะเป็นกำลังพิมพ์
        setIsPrinting(true);
        summaryToPrint.group = isGroupPrint ? 2 : 1;

        console.log("Summary to print:", summaryToPrint);
        setDateTicket(summaryToPrint);
        const fetchData = async () => {
            setLoading(true);
            setErrorMessage('');
            localStorage.setItem('idPrint', idprint);
            try {
                if (odid === null) {
                    const url = `${API_ENDPOINT}/api/v1/zoo/pos/ticket_order`;
                    const myHeaders = new Headers();
                    myHeaders.append("X-API-KEY", token);
                    myHeaders.append("Content-Type", "application/json");

                    const raw = JSON.stringify(summaryToPrint);
                    console.log(raw)
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };

                    const response = await fetch(url, requestOptions);
                    const responseData = await response.json();
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
                    // console.log(responseData)
                    setRef1(responseData.order.ref1);
                    setRef2(responseData.order.ref2);
                    // console.log(responseData.order);
                    setIoall(responseData.order.amount);
                    setOrder(responseData.ticket);
                    if (responseData.status === 'success') {
                        setOdid(responseData.id);
                        setCheckPrint(true)
                        setidPrint(idprint)



                        console.log('data:', responseData);

                        // Additional UI updates can be added here
                    } else {
                        throw new Error(responseData.message);
                    }
                } else {
                    // Logic for when odid is already set
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setErrorMessage(`Error: ${error.message}`);
            } finally {
                setisProcessing(false)
                setLoading(false);
            }
        };

        await fetchData();
    };
    const cancelOrder = () => {
        // navigate('/pos');
        window.location = '/handheld/handheld'
    };
    const Print = () => {
        setIsPrinting(true);
    
        if (!DateTicket || !Order || !Array.isArray(DateTicket.data)) {
            alert("ไม่พบข้อมูลสำหรับการพิมพ์");
            setIsPrinting(false);
            return;
        }
    
        const printContent = Order.map((tk) => {
            const qrCode = ReactDOMServer.renderToString(<QRCode value={`${Ref1}/${tk.id}`} size={200} />);
            return `
                <div class="ticket">
                    <div class="ticket-header">
                        <h4>Zoo Ticket</h4>
                    </div>
                    <div class="qr-code">
                        ${qrCode}
                    </div>
                    <div class="ticket-info">
                        <h3>Zoo: <span>${localStorage.getItem('zooname')}</span></h3>
                        <h3>Number: <span>${Ref1}/${tk.id}</span></h3>
                        <h3>Expiry: <span>${tk.expire_date}</span></h3>
                        <h3>Ticket: <span>${tk.ticket_type_name}</span></h3>
                        <h3>Price: <span>${tk.ticket_type_price} บาท</span></h3>
                    </div>
                </div>
            `;
        });
    
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                  <style>
                    @page {
                      size: 80mm auto; /* กำหนดขนาดกระดาษ 58 มม. */
                      margin: 5mm;
                    }
                    body {
                      font-family: 'Arial', sans-serif;
                      margin: 0;
                      padding: 0;
                      width: 80mm; /* กำหนดความกว้างของ body */
                      height: auto; /* ให้ปรับตามเนื้อหา */
                      color: #333;
                    }
                    .ticket {
                 
                      margin-bottom: 10px;
                      background-color: #fff;
                      border-radius: 12px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .ticket-header {
                      text-align: center;
                      color: #fff;
                    
                      border-radius: 8px 8px 0 0;
                      margin-bottom: 10px;
                    }
                    .ticket-header h4 {
                      margin: 0;
                      font-size: 16px;
                    }
                    .qr-code {
                      text-align: center;
                      margin-bottom: 10px;
                    }
                    .ticket-info h6 {
                      margin: 5px 0;
                      font-size: 12px;
                      color: #333;
                    }
                    .ticket-info h6 span {
                      font-weight: bold;
                    }
                  </style>
                </head>
                <body>
                  ${printContent.join('')}
                </body>
            </html>
        `);
    
        printWindow.document.close();
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 1000); // หน่วงเวลา 1 วินาที
        };
    
        setTimeout(() => {
            setCheckPrint(false);
            setIsPrinting(false);
            setIsPrinted(true); // แสดงปุ่ม "ทำรายการใหม่"
            window.location = '/handheld/handheld'
        }, 3000);
    };
    


    const PrintSum = () => {
        setIsPrinting(true);
    
        // ตรวจสอบข้อมูล
        if (!DateTicket || !DateTicket.data || !Array.isArray(DateTicket.data)) {
            alert("ไม่พบข้อมูลสำหรับการพิมพ์");
            setIsPrinting(false);
            return;
        }
    
        // คำนวณราคาทั้งหมด
        const totalAmount = DateTicket.data.reduce((sum, tk) => sum + parseFloat(tk.total_amount || 0), 0);
    
        const headerContent = `
            <div class="ticket-header">
                <h6>Zoo Ticket</h6>
            </div>
            <div class="qr-code">
                ${ReactDOMServer.renderToString(<QRCode value={`${Ref1}`} size={200} />)}
            </div>
            <div class="ticket-info">
                <h6>Zoo: <span>${localStorage.getItem('zooname')}</span></h6>
                <h6>Number: <span>${Ref1}</span></h6>
                <h6>Expiry: <span>${new Date().toLocaleDateString("th-TH")}</span></h6>
            </div>
        `;
    
        const ticketListContent = `
            <table style="width: 100%; border-collapse: collapse; font-size: 18px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 5px; text-align: left; font-size: 18px; font-weight: bold;">Ticket</th>
                        <th style="border: 1px solid #ddd; padding: 5px; text-align: right; font-size: 18px; font-weight: bold;">Price</th>
                        <th style="border: 1px solid #ddd; padding: 5px; text-align: right; font-size: 18px; font-weight: bold;">Qty</th>
                    </tr>
                </thead>
                <tbody>
                    ${DateTicket.data.map((tk) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 5px; font-size: 18px; font-weight: bold;">${tk.name}</td>
                            <td style="border: 1px solid #ddd; padding: 5px; font-size: 18px; text-align: right; font-weight: bold;">${tk.total_amount}</td>
                            <td style="border: 1px solid #ddd; padding: 5px; font-size: 18px; text-align: right; font-weight: bold;">${tk.input_val}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    
        const totalPriceContent = `
            <div style="margin-top: 10px; text-align: right; font-size: 18px; font-weight: bold;">
                Total: <span style=" font-size: 18px; font-weight: bold;">${totalAmount.toFixed(2)} บาท</span>
            </div>
        `;
    
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        @page {
                            size: 80mm auto; /* ขนาดกระดาษ 58 มม. */
                            margin: 5mm;
                        }
                        body {
                            font-family: 'Arial', sans-serif;
                            font-size: 12px;
                            margin: 0;
                            padding: 0;
                            width: 80mm; /* กำหนดความกว้างของ body */
                            height: auto; /* ให้ปรับตามเนื้อหา */
                        }
                        .ticket-header {
                            text-align: center;
                            margin-bottom: 10px;
                            font-size: 18px;
                        }
                        .qr-code {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .ticket-info {
                            margin-bottom: 10px;
                        }
                        .ticket-info h6 {
                            margin: 0;
                            font-size: 18px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 5px;
                            font-size: 10px;
                            text-align: left;
                        }
                        th {
                            font-weight: bold;
                        }
                        .total-price {
                            text-align: right;
                            font-size: 12px;
                            font-weight: bold;
                            margin-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    ${headerContent}
                    ${ticketListContent}
                    ${totalPriceContent}
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
    
        setTimeout(() => {
            setCheckPrint(false);
            setIsPrinting(false);
            setIsPrinted(true); // แสดงปุ่ม "ทำรายการใหม่"
            window.location = '/handheld/handheld'
        }, 3000);
    };
    



    const handleNewTransaction = () => {
        setShowUI(false);
        setIsPrinted(false); // ซ่อนปุ่ม "ทำรายการใหม่"
        window.location = '/handheld/handheld'
    };

    return (
        <div className="container mt-4 py-2">
            <div className="row">
                {/* Ticket Information Section */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5>ตั๋วเข้าชมสวนสัตว์ : {localStorage.getItem('zooname') || ''}</h5>
                            <h6>วันที่เข้าชม : {new Date().toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}</h6>
                        </div>
                        {ticketSummary ? (
                            <div className="card-body">
                                <h5>รายการ: {odid || ''}</h5>
                                <table className="table table-bordered mt-3">
                                    <thead className="table-light">
                                        <tr>
                                            <th>รายการ</th>
                                            <th>ราคา</th>
                                            <th>จำนวน</th>
                                            <th>ราคารวม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ticketSummary.data.map(ticket => (
                                            <tr key={ticket.elid}>
                                                <td>{ticket.name}</td>
                                                <td>{ticket.amount} บาท</td>
                                                <td>{ticket.input_val}</td>
                                                <td>{ticket.total_amount} บาท</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-3">
                                    <h6>รวมรายการตั๋ว: {ticketSummary.data.length} ใบ</h6>
                                    <h6>ยอดรวม: {ticketSummary.amount} บาท</h6>
                                </div>
                            </div>
                        ) : (
                            <p className="card-body text-muted">ไม่มีข้อมูลสรุปการจองตั๋ว</p>
                        )}
                    </div>

                    {/* Order Details */}
                    {/* <div className="card mt-3" style={{ backgroundColor: '#fff2e7' }}>
                        <div className="card-header">รายละเอียดคำสั่งซื้อ</div>
                        <div className="card-body">
                            <p>หมายเลขคำสั่งซื้อ : {odid}</p>
                            <p>หมายเลขอ้างอิง 1 : {Ref1}</p>
                            <p>หมายเลขอ้างอิง 2 : {Ref2}</p>
                            <p>จำนวนเงิน : {Ioall} บาท</p>
                        </div>
                        <div className="card-footer text-end">
                            วันที่ทำรายการ : {new Date().toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </div>
                    </div> */}
                </div>

                {/* Payment and Actions Section */}
                <div className="col-md-6">
                    <div className="alert alert-info text-center">
                        <strong>วิธีการชำระ: ชำระด้วย / เงินสด</strong>
                    </div>






                    {/* Action Buttons */}
                    <div className="row mt-4">
                    {!isConfirmed && ( // แสดงปุ่มเมื่อยังไม่ได้ยืนยันรายการ
                <>
                    <div className="col-6">
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => handlePrint(false, 1)}
                            disabled={loadingbtn}
                        >
                            {loadingbtn && (
                                <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            )}
                            ยืนยันรายการ
                        </button>
                    </div>
                    <div className="col-6">
                        <button
                            className="btn btn-danger w-100"
                            onClick={cancelOrder}
                            disabled={loadingbtn}
                        >
                            {loadingbtn && (
                                <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            )}
                            ยกเลิก
                        </button>
                    </div>
                </>
            )}
                    </div>

                    <div className="row mt-3">
                        <div className="col-6">
                            {CheckPrint && (
                                <button className="btn btn-success w-100" onClick={Print}>

                                    พิมพ์ตั๋วเดี๋ยว
                                </button>
                            )}
                        </div>
                        <div className="col-6">
                            {CheckPrint && (
                                <button
                                    className="btn btn-secondary w-100"
                                    onClick={() => PrintSum()}
                                //  disabled={loadingbtn}
                                >
                                    {/* {loadingbtn && <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>} */}
                                    พิมพ์ตั๋วกลุ่ม
                                </button>
                            )}
                        </div>

                        <div className="col-12">
                            {isPrinted && (
                                <button className="btn btn-warning px-4 w-100" onClick={handleNewTransaction}>
                                    ทำรายการใหม่/หน้าขาย
                                </button>
                            )}

                        </div>
                    </div>

                    {/* ข้อความสถานะการพิมพ์ */}
                    {isPrinting && (
                        <div className="mt-3 text-center">
                            <div className="alert alert-info" role="alert">
                                กำลังพิมพ์... กรุณารอสักครู่
                            </div>
                        </div>
                    )}






                </div>
            </div>
        </div>
    );


}

export default CashPage;





















// import React, { useState } from "react";
// import QRCode from "react-qr-code";

// const tickets = [
//     {
//         id: "TK001",
//         tickettypes: {
//             name: "ผู้ใหญ่ ชาย",
//             price: 200,
//         },
//         tk_limit: 100,
//         tk_count: 50,
//     },
//     {
//         id: "TK002",
//         tickettypes: {
//             name: "ผู้ใหญ่ หญิง",
//             price: 200,
//         },
//         tk_limit: 100,
//         tk_count: 70,
//     },
//     {
//         id: "TK003",
//         tickettypes: {
//             name: "เด็ก ชาย",
//             price: 100,
//         },
//         tk_limit: 50,
//         tk_count: 30,
//     },
//     {
//         id: "TK004",
//         tickettypes: {
//             name: "เด็ก หญิง",
//             price: 100,
//         },
//         tk_limit: 50,
//         tk_count: 10,
//     },
// ];

// const order = {
//     ref1: "OID123456789",
//     created_at: "2024-12-25T10:30:00",
// };

// const TicketReceipt = () => {
//     const [showUI, setShowUI] = useState(false); // state สำหรับควบคุมการแสดง UI
//     const [isPrinting, setIsPrinting] = useState(false); // state สำหรับแสดงสถานะการพิมพ์
//     const [isPrinted, setIsPrinted] = useState(false); // state สำหรับแสดงปุ่ม "ทำรายการใหม่"

//     const handlePrint = () => {
//         setIsPrinting(true);
//         const printContent = document.getElementById("print-content");

//         if (!printContent) {
//             alert(" ไม่พบเนื้อหาเพื่อพิมพ์ กรุณากดแสดงข้อมูลทุกครั้งก่อนพิมพ์");
//             setIsPrinting(false);
//             return;
//         }

//         const printWindow = window.open("", "_blank");
//         printWindow.document.write(`
//       <html>
//         <head>
//           <style>
//             @page {
//               size: 200mm;
//               margin-left: 25px;
//             }
//             body {
//               font-family: Arial, sans-serif;
//             }
//             .receipt-table {
//               margin-bottom: 20px;
//               width: 100%;
//             }
//             .receipt-table h6 {
//               margin: 5px 0;
//             }
//           </style>
//         </head>
//         <body>${printContent.innerHTML}</body>
//       </html>
//     `);
//         printWindow.document.close();
//         printWindow.focus();
//         printWindow.print();
//         printWindow.close();
//         setTimeout(() => {
//             setIsPrinting(false);
//             setIsPrinted(true); // แสดงปุ่ม "ทำรายการใหม่"
//         }, 2000);
//     };

//     const handleNewTransaction = () => {
//         setShowUI(false);
//         setIsPrinted(false); // ซ่อนปุ่ม "ทำรายการใหม่"
//     };

//     return (
//         <div className="container mt-4">
//             {/* ปุ่มพิมพ์ */}
//             <div className="text-center">
//                 <button className="btn btn-primary px-4" onClick={() => setShowUI(!showUI)}>
//                     {showUI ? "ซ่อนข้อมูล" : "แสดงข้อมูล"}
//                 </button>
//                 <button className="btn btn-success px-4 ms-2" onClick={handlePrint}>
//                     พิมพ์ใบเสร็จ
//                 </button>
//             </div>

//             {/* ข้อความสถานะการพิมพ์ */}
//             {isPrinting && (
//                 <div className="mt-3 text-center">
//                     <div className="alert alert-info" role="alert">
//                         กำลังพิมพ์... กรุณารอสักครู่
//                     </div>
//                 </div>
//             )}

//             {isPrinted && (
//                 <div className="mt-3 text-center">
//                     <button className="btn btn-warning px-4" onClick={handleNewTransaction}>
//                         ทำรายการใหม่
//                     </button>
//                 </div>
//             )}
//             {/* ส่วน UI (ซ่อนได้/แสดงได้) */}
//             {showUI && (
//                 <div className="row">
//                     <div className="col-md-12">
//                         <div className="receipt_hand" id="print-content">
//                             {tickets.map((tk) => (
//                                 <table className="receipt-table" key={tk.id}>
//                                     <tbody>
//                                         <tr align="center" style={{ paddingBottom: "10px" }}>
//                                             <td>
//                                                 <QRCode value={`${order.ref1}/${tk.id}`} size={150} />
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td>
//                                                 <h6>OID: {order.ref1}</h6>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td>
//                                                 <h6>TID: {tk.id}</h6>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td>
//                                                 <h6>CRE: {order.created_at}</h6>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td>
//                                                 <h6>
//                                                     EXP: {new Date().toLocaleDateString("th-TH")} เวลา 18:00:00
//                                                 </h6>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td>
//                                                 <h6>Type: {tk.tickettypes.name}</h6>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td align="center">
//                                                 <h6>Price: {tk.tickettypes.price} บาท</h6>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             ))}
//                             <p>________________________________</p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TicketReceipt;

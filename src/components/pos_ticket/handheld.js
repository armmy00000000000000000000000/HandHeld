


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Ticket } from '../config/api'; // นำเข้าฟังก์ชันที่สร้างขึ้น
import './PosTicket.css';
import car from '../image/car.png'; // นำเข้ารูปภาพ
import bus from '../image/bus.png'; // นำเข้ารูปภาพ
import moto from '../image/moto.png'; // นำเข้ารูปภาพ
import re from '../image/004.gif'; // นำเข้ารูปภาพ
import Navbar from '../navbar/nav';
function Handheld() {
    const [loading, setLoading] = useState(true);
    const [tickettype, setTickettype] = useState([]);
    const [ticket, setTicket] = useState([]);
    const [selectedTicketType, setSelectedTicketType] = useState(null);
    const [selectedTickets, setSelectedTickets] = useState([]); // สำหรับเก็บรายการตั๋วที่เลือก
    const [allTickets, setAllTickets] = useState([]);
    const machine_zoo_id = localStorage.getItem('machine_zoo_id');
    const userid = localStorage.getItem('userid');
    const machine_id = localStorage.getItem('machine_id');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // Default value
    const user = localStorage.getItem('user');
    const machine = localStorage.getItem('machine');
    // สร้างอ็อบเจ็กต์สำหรับจับคู่ชื่อไฟล์กับอิมเมจที่นำเข้า
    const [showTickets, setShowTickets] = useState(false); // state สำหรับควบคุมการแสดงผล

    const toggleTickets = () => {
        setShowTickets(!showTickets); // เปลี่ยนสถานะซ่อน/แสดง
    };


    const ticketImages = {
        'car.png': car,
        'bus.png': bus,
        'moto.png': moto,
    };
    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
        console.log(event.target.value)
    };
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const list_ticket = await Ticket(machine_zoo_id, token, machine);
                setTickettype(list_ticket.type);
                setAllTickets(list_ticket.tickettypes);
                setTicket(list_ticket.tickettypes);
                setLoading(false);

                if (list_ticket.type.length > 0) {
                    const defaultTypeId = list_ticket.type[0].id;
                    setSelectedTicketType(defaultTypeId);
                    const defaultTickets = list_ticket.tickettypes.filter(t => t.tab_id === defaultTypeId.toString());
                    setTicket(defaultTickets);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setLoading(false);
            }
        };

        fetchTickets();
    }, [machine, machine_zoo_id, token]);

    useEffect(() => {
        const newTotalAmount = calculateTotalAmount();
        console.log(newTotalAmount);
        setTotalAmount(newTotalAmount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTickets]);



    const calculateTotalAmount = () => {
        return selectedTickets.reduce((sum, ticket) => sum + ticket.total_amount, 0);
    };

    const handleTicketTypeChange = (typeId) => {

        const typeIdString = String(typeId);
        const filteredTickets = allTickets.filter(t => String(t.tab_id) === typeIdString);
        setSelectedTicketType(typeId);
        setTicket(filteredTickets);
    };
    const cear_data = () => {
        setSelectedTickets([])

    };

    const handleTicketSelection = (ticket) => {
        const existingTicket = selectedTickets.find(t => t.id === ticket.id);
        if (existingTicket) {
            // อัปเดตจำนวนตั๋วที่เลือก
            const updatedTickets = selectedTickets.map(t =>
                t.id === ticket.id
                    ? { ...t, input_val: String(Number(t.input_val) + 1), total_amount: (Number(t.input_val) + 1) * t.price }
                    : t
            );
            setSelectedTickets(updatedTickets);
        } else {
            // เพิ่มตั๋วใหม่ไปยังรายการที่เลือก
            setSelectedTickets([...selectedTickets, {
                ...ticket,
                input_val: 1,
                total_amount: ticket.price
            }]);
        }
    };

    const handleTicketRemove = (ticketId) => {
        setSelectedTickets(selectedTickets.filter(ticket => ticket.id !== ticketId));
    };

    const handleCountChange = (ticketId, operation) => {
        setSelectedTickets(prevTickets =>
            prevTickets.map(ticket => {
                if (ticket.id === ticketId) {
                    const newInputVal = operation === '+' ? (Number(ticket.input_val) + 1) : (Number(ticket.input_val) - 1);
                    if (newInputVal <= 0) return null; // If the quantity drops to zero or below, don't keep the ticket in the list
                    return { ...ticket, input_val: newInputVal, total_amount: newInputVal * ticket.price };
                }
                return ticket;
            }).filter(ticket => ticket !== null) // Filter out tickets that are null
        );
    };
    const handleInputChange = (ticketId, value) => {
        const inputValue = Math.max(Number(value)); // กำหนดค่าต่ำสุดเป็น 0
        setSelectedTickets(prevTickets =>
            prevTickets.map(ticket => {
                if (ticket.id === ticketId) {
                    return { ...ticket, input_val: inputValue, total_amount: inputValue * ticket.price };
                }
                return ticket;
            })
        );
    };



    const createTicketSummary = () => {
        const data = selectedTickets.map(ticket => ({
            name: ticket.name,
            elid: `ticket_${ticket.id}`,
            amount: ticket.price,
            xid: ticket.id,
            input_val: ticket.input_val,
            total_amount: ticket.total_amount,
            ais_code_storage: [],
            car_post_storage: []
        }));

        const totalAmount = selectedTickets.reduce((sum, ticket) => sum + ticket.total_amount, 0);

        return {
            data: data,
            amount: totalAmount.toString(),
            payment_method: paymentMethod,
            reserve: "",
            group: 1,
            aid: userid,
            machine_id: machine_id,
            user: JSON.parse(user),
            machine: JSON.parse(machine)
        };
    };

    // Example of using the function
    const ticketSummary = createTicketSummary();
    console.log(ticketSummary);
    const handleSubmit = () => {
        const ticketSummary = createTicketSummary();

        if (paymentMethod === 'qrcode') {
            navigate('/qrcode', { state: { ticketSummary } });
        } else {
            navigate('/cash', { state: { ticketSummary } }); // Assuming a route for cash as well
        }
    };
    if (loading) {
        return (
            <div className="loading">
                <img width={100} src={re} alt="Loading..." />
                Loading...
            </div>
        );
    }
    if (!tickettype || !ticket) return <p className="loading">กรุณาลอง รีเฟรชหน้าจออีกครั้ง หรือเข้าสู่ระบบใหม่</p>;
    return (
        <div className="mt-1">
      <Navbar />
            <div className="row">
                <div className="col-md-8" style={{ overflowY: 'auto', maxHeight: '100vh' }}>

                    <div className="row  ms-5">

                        {/* <div className="col-12 col-md-6 col-xl-8">
                            <div className="user-info p-3 rounded shadow-sm">
                                <p className="m-0">
                                    <span className="text-muted">ผู้ใช้งาน:</span>
                                    <span className="fw-bold text-primary ms-2">{localStorage.getItem('name')}</span>
                                </p>
                                <p className="m-0">
                                    <span className="text-muted">รหัสผู้ใช้:</span>
                                    <span className="fw-bold text-secondary ms-2">{localStorage.getItem('emp_code')}</span>
                                </p>
                                <p className="m-0 mt-2">
                                    <span className="text-muted">หน้าขาย:</span>
                                    <span className="fw-bold text-success ms-2">{localStorage.getItem('zooname') || 'N/A'}</span>
                                </p>
                            </div>
                        </div> */}

                        {/* <div className="col-12 col-md-6 col-xl-4 d-flex justify-content-start justify-content-md-end pe-5 mt-3 mt-md-0">
                            <Link
                                to="/home"
                                type="button"
                                className="m-1 m-xl-2 fw-bold px-1 px-md-2 px-xl-4 btn btn-primary shadow-sm rounded-pill"
                            >
                                Home
                            </Link>
                            <Link
                                to="/order_report"
                                type="button"
                                className="m-1 m-xl-2 fw-bold px-1 px-md-2 px-xl-4 btn btn-warning shadow-sm rounded-pill"
                            >
                                Recheck
                            </Link>
                            <Link
                                to="/ticket_report"
                                type="button"
                                className="m-1 m-xl-2 fw-bold px-1 px-md-2 px-xl-4 btn btn-info shadow-sm rounded-pill"
                            >
                                Report
                            </Link>
                        </div> */}


                    </div>


                    <div className="mb-2">
                        <div className="container mt-4">
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-primary dropdown-toggle w-100"
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {selectedTicketType
                                        ? tickettype.find((type) => type.id === selectedTicketType)?.name
                                        : 'เลือกประเภทตั๋ว'}
                                </button>
                                <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                    {tickettype.map((type) => (
                                        <li key={type.id}>
                                            <button
                                                className={`dropdown-item ${selectedTicketType === type.id ? 'active' : ''}`}
                                                onClick={() => handleTicketTypeChange(type.id)}
                                            >
                                                {type.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>



                    <div className="mb-4 container">
                        <div className="row">
                            <div className='col-md-4'>
                                <div className='row'>
                                    {ticket.filter(t => t.group === 'a').map((t, index) => (
                                        <div className="col-6 col-sm-6  col-md-6 col-lg-6 col-xl-6 " key={index}>
                                            <div className={`card1 mb-3 py-3 text-center ${t.tk_limit === null ? 'alert alert-info' : (t.tk_limit - t.tk_count === 0 ? 'bg-secondary' : 'alert alert-info')} ${t.colorClass}`} onClick={() => {
                                                // กดได้ถ้า tk_limit เป็น null หรือ tk_limit - tk_count มากกว่า 0
                                                if (t.tk_limit === null || (t.tk_limit - t.tk_count) > 0) {
                                                    handleTicketSelection(t);
                                                }
                                            }}>
                                                {/* <div className="card-body"> */}
                                                <b>{t.name}</b>
                                                <p className="card-text"></p>
                                                <div class="text-end">
                                                    <b style={{ color: 'black' }}>{t.price}</b>

                                                </div>

                                                {t.tk_limit !== null && (
                                                    <p className="card-text">
                                                        เหลือสิท: {t.tk_limit - t.tk_count}
                                                        {t.tk_limit - t.tk_count === 0}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}


                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="row">
                                    {ticket.filter(t => t.group === 'b').map((t, index) => (
                                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-3" key={index}>
                                            <div className={`card1 mb-3 py-3 text-center ${t.tk_limit === null ? 'alert alert-success' : (t.tk_limit - t.tk_count === 0 ? 'bg-secondary' : 'alert alert-success')} ${t.colorClass}`} onClick={() => {
                                                // กดได้ถ้า tk_limit เป็น null หรือ tk_limit - tk_count มากกว่า 0
                                                if (t.tk_limit === null || (t.tk_limit - t.tk_count) > 0) {
                                                    handleTicketSelection(t);
                                                }
                                            }}>
                                                <b>{t.name}</b>
                                                <p className="card-text"></p>
                                                <div class="text-end">
                                                    <b style={{ color: 'black' }}>{t.price}</b>

                                                </div>
                                                {t.tk_limit !== null && (
                                                    <p className="card-text">
                                                        เหลือสิท: {t.tk_limit - t.tk_count}
                                                        {t.tk_limit - t.tk_count === 0 && <span> </span>}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* {ticket.filter(t => t.group === 'b').map((t, index) => (
                                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-3" key={index}>
                                            <div className={`card1  bg-success mb-3 py-3 text-center ${t.colorClass}`} onClick={() => handleTicketSelection(t)}>
                                                <div className="card-body">
                                                    <p className="card-text">{t.name}<br />{t.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className="row">
                                    {ticket.filter(t => t.group === 'c').map((t, index) => (
                                        <div className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-3" key={index}>
                                            <div className={`card1 ${t.tk_limit === null ? 'alert alert-primary' : (t.tk_limit - t.tk_count === 0 ? 'bg-secondary' : 'alert alert-primary')} mb-3 py-3 text-center ${t.colorClass}`} onClick={() => {
                                                // กดได้ถ้า tk_limit เป็น null หรือ tk_limit - tk_count มากกว่า 0
                                                if (t.tk_limit === null || (t.tk_limit - t.tk_count) > 0) {
                                                    handleTicketSelection(t);
                                                }
                                            }}>
                                                <b style={{ color: 'black' }}>{t.name}</b>
                                                <p className="card-text"></p>
                                                <div class="text-end">
                                                    <b style={{ color: 'black' }}>{t.price}</b>

                                                </div>
                                                {t.tk_limit !== null && (
                                                    <p className="card-text">
                                                        เหลือสิท: {t.tk_limit - t.tk_count}
                                                        {t.tk_limit - t.tk_count === 0 && <span> </span>}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* {ticket.filter(t => t.group === 'c').map((t, index) => (
                                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 mb-3" key={index}>
                                            <div className={`card1  bg-primary mb-3 py-3 text-center ${t.colorClass}`} onClick={() => handleTicketSelection(t)}>
                                                <div className="card-body">
                                                    <p className="card-text">{t.name}<br />{t.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-2 container">
                        <div className="row">
                            {ticket.filter(t => t.group === 'car').map((t, index) => (
                                <div className="col-md-4 mb-2" key={index}>
                                    <div
                                        className={`info-box ${t.tk_limit === null ? 'alert alert-warning' : (t.tk_limit - t.tk_count === 0 ? 'bg-secondary' : 'alert alert-warning')} text-center fw-bold p-1 rounded-3`}
                                        data-name={t.name}
                                        data-price={t.price}
                                        data-type="ticket"
                                        onClick={() => {
                                            // กดได้ถ้า tk_limit เป็น null หรือ tk_limit - tk_count มากกว่า 0
                                            if (t.tk_limit === null || (t.tk_limit - t.tk_count) > 0) {
                                                handleTicketSelection(t);
                                            }
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', padding: '5px' }}
                                    >
                                        <span className="info-box-icon" style={{ marginRight: '5px' }}>
                                            <img
                                                src={ticketImages[t.ico] || car}
                                                alt={t.name}
                                                data-type="ticket"
                                                style={{ height: "80px" }}
                                            />
                                        </span>
                                        <div className="info-box-content bg-white rounded-2 p-1" style={{ flexGrow: 1 }}>
                                            {/* <p className="info-box-text mb-0" style={{ fontSize: '14px' }}>
                                                {t.name}
                                            </p>
                                            <p className="info-box-number mb-0 fw-normal" style={{ fontSize: '12px' }}>
                                                {t.price}
                                            </p> */}

                                            <div class="p-2">
                                                <b> {t.name}</b>
                                                <div class="text-end">
                                                    <b style={{ color: '' }}>  {t.price}</b>
                                                </div>
                                            </div>
                                            {t.tk_limit !== null && (
                                                <p className="info-box-available mb-0">
                                                    เหลือสิท: {t.tk_limit - t.tk_count}
                                                    {t.tk_limit - t.tk_count === 0 && <span> </span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>



                </div>

                <div>
                    {/* ปุ่มลอย */}
                    <button
                        className="btn btn-primary floating-button  position-fixed"
                        onClick={toggleTickets}
                    >
                        <span
                            className="position-absolute top-0 start-30 translate-middle badge rounded-pill bg-danger"
                        >
                            {selectedTickets.length}
                        </span>
                        {showTickets ? 'ปิดรายการ' : 'เช็ครายการ'}
                    </button>



                    {/* ส่วนรายการ */}
                    {showTickets && (
                        <div className="col-md-4 floating-card" style={{ overflowY: 'auto', maxHeight: '90vh' }}>
                            <div className="card">
                                <div className="card-header text-center">
                                    รายการตั๋ว
                                </div>
                                <div>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ประเภท</th>
                                                <th>จำนวน</th>
                                                <th>ราคา</th>
                                                <th>ลบ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTickets.map(ticket => (
                                                <tr key={ticket.id}>
                                                    <td>{ticket.name}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() => handleCountChange(ticket.id, '-')}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                className="form-control mx-2"
                                                                value={ticket.input_val}
                                                                onChange={(e) => handleInputChange(ticket.id, e.target.value)}
                                                                min="0"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary btn-sm"
                                                                onClick={() => handleCountChange(ticket.id, '+')}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>{ticket.total_amount}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleTicketRemove(ticket.id)}
                                                        >
                                                            ลบ
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3" className="text-end"><strong>ยอดรวม</strong></td>
                                                <td>{totalAmount} บาท</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card-header text-center mt-3">
                                ประเภทการชำระเงิน
                            </div>
                            <div className="card-body">
                                <div className="wrapper col-md-12">
                                    <input
                                        type="radio"
                                        name="select"
                                        id="option-1"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={handlePaymentChange}
                                    />
                                    <label htmlFor="option-1" className="option option-1">
                                        <div className="dot"></div>
                                        <span>เงินสด</span>
                                    </label>
                                    <input
                                        type="radio"
                                        name="select"
                                        id="option-2"
                                        value="qrcode"
                                        checked={paymentMethod === 'qrcode'}
                                        onChange={handlePaymentChange}
                                    />
                                    <label htmlFor="option-2" className="option option-2">
                                        <div className="dot"></div>
                                        <span>QR-CODE</span>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary w-100 mt-3"
                                onClick={() => handleSubmit()}
                                disabled={selectedTickets.length === 0}
                            >
                                ชำระเงิน
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger w-100 mt-2"
                                onClick={() => cear_data()}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Handheld;






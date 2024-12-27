import Login from './components/login/login';
import Home from './components/home/home';
import Handheld from './components/pos_ticket/handheld';
import QRCodePage from './components/pos_ticket/QRCodePage';
import CashPage from './components/pos_ticket/CashPage';
import Orderreport from './components/report/order_report';
import DetailOrder from './components/report/detail_order';
import Ticketsalesreport from './components/report/ticket_sales_report';
import './App.css';
import { Routes, Route } from 'react-router-dom';
function App() {
  const date = new Date(); // วันที่ปัจจุบัน
  const timezone = 'Asia/Bangkok'; // ปรับ timezone ตามที่ต้องการ

  const formattedDate = new Intl.DateTimeFormat('th-TH', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div>
        <Routes>
          <>
            <Route path='/Login' element={<Login />} />
            <Route path='/' element={<Login />} />


          </>
        </Routes>
      </div>
    );

  } else {
    return (
      <div>
        <Routes>
          <>
            <Route path='/' element={<Handheld />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/handheld' element={<Handheld />} />
            <Route path='/qrcode' element={<QRCodePage />} />
            <Route path='/cash' element={<CashPage />} />
            <Route path='/order_report' element={<Orderreport />} />
            <Route path='/ticket_report' element={<Ticketsalesreport />} />
            <Route path='/detail_order' element={<DetailOrder />} />

          </>
        </Routes>
      </div>
    );
  }
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../config/api'; // นำเข้าฟังก์ชันที่สร้างขึ้น

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mac, setMac] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // เพิ่มสถานะ isLoggedIn เพื่อเก็บสถานะการล็อกอินของผู้ใช้
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
    //   setIsLoggedIn(true);
      navigate('/handheld'); // นำทางไปยังหน้าหลักโดยตรงหากผู้ใช้ล็อกอินอยู่แล้ว
    }
  }, [navigate]);


  // useEffect(() => {
  //   get_mac();
  // }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser(email, password);
      setResponse(result.message);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const get_mac = async () => {
    
    try {
      const response_mac = await fetch("http://localhost/pos_client_print/get_mac.php");
      
      // Check if response is OK
      if (!response_mac.ok) {
        throw new Error(`HTTP error! Status: ${response_mac.status}`);
      }
  
      const result = await response_mac.json(); // Parse response as JSON
      setMac(result);
      console.log(result);
    } catch (error) {
      console.error("Failed to fetch MAC address:", error);
    }
  };
  

  return (
    <div>
      {/* Login - Bootstrap Brain Component */}
      <div className="bg-light py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
              <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h3>ZOO E-Ticket (HandHeld) </h3>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden">
                    <div className="col-12">
                      <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    {/* <div className="col-12">
                      <label htmlFor="mac" className="form-label">MAC Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="mac"
                        value={mac}
                        onChange={(e) => setMac(e.target.value)}
                        required
                      />
                    </div> */}
                    <div className="col-12">
                      <div className="d-grid">
                        <button className="btn btn-lg btn-primary" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Log in'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                {response && <div className="mt-3 alert alert-danger">{response}</div>}
                {error && <div className="mt-3 alert alert-danger">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

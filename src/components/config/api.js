// apiFunctions.js
import { API_ENDPOINT } from './config';
import Swal from 'sweetalert2'; // อย่าลืม import SweetAlert

export const loginUser = async (email, password) => {

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    email,
    password,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };


    const response = await fetch(`${API_ENDPOINT}/api/v1/zoo/public/authen/handheld/login`, requestOptions);

    if (response.status === 201) {
 
      const result = await response.json();
      console.log(result);

      // Store details in localStorage
      localStorage.setItem('email', result.user.user_profile.email);
      localStorage.setItem('userid', result.user.user_profile.user_id);
      localStorage.setItem('id', result.user.id);
      localStorage.setItem('name', result.user.user_profile.first_name);
      localStorage.setItem('user_zoo_id', result.user.user_profile.zoo_id);
      localStorage.setItem('machine_id', result.user.machine_id);
      localStorage.setItem('machine_zoo_id', result.machine.zoo.id);
      localStorage.setItem('token', result.api_key); 
      localStorage.setItem('emp_code', result.user.user_profile.emp_code); 
      localStorage.setItem('user_role', result.user.roles[0].name); 
      localStorage.setItem('pc_name', result.machine.name); 
      localStorage.setItem('machine', JSON.stringify(result.machine));
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('zooname', result.machine.zoo.name);

      window.location = '/handheld/handheld';
      return {
        status: response.status,
        message: 'ข้อมูลถูกต้อง', 
        data: result.result
      };
    } else {
      if (response.status === 401) {
        return {
          status: response.status,
          message: 'ข้อมูลไม่ถูกต้อง' 
        };
      } else if (response.status === 500) {
        return {
          status: response.status,
          message: 'เครื่องยังไม่ลงทะเบียน' 
        };
      } else {
        return {
          status: response.status,
          message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' 
        };
      }
    }

};

const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/handheld/login';
};

export const Ticket = async (zooid,key,machine) => {

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append("X-API-KEY",  key);
  // myHeaders.append("Authorization", myHeaders.append("Authorization", `Bearer ${key}`));
  const raw = JSON.stringify({
    "machine": JSON.parse(machine)
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(`${API_ENDPOINT}/api/v1/zoo/pos/list_ticket`, requestOptions);

    if (response.ok) {
      // Check if the response status is 200
      const result = await response.json();
      console.log(result.tabs);

    
      return {
        status: response.status,
        message: 'ข้อมูลถูกต้อง', // Data is correct
        type: result.tabs,
        tickettypes: result.tickettypes
      };
    } else {
      if (response.status === 401) {
       // แจ้งเตือนให้ผู้ใช้ล็อกเอาท์เมื่อได้รับสถานะ 401
       Swal.fire({
        title: 'Token หมดอายุ',
        text: 'กรุณาเข้าสู่ระบบใหม่',
        icon: 'warning',
        confirmButtonText: 'ล็อกเอาท์',
      }).then((result) => {
        if (result.isConfirmed) {
          handleLogout(); // ฟังก์ชันล็อกเอาท์
        }
      });

      return {
        status: response.status,
        message: 'ข้อมูลไม่ถูกต้อง'
      };
      } else if (response.status === 500) {
        return {
          status: response.status,
          message: 'เครื่องยังไม่ลงทะเบียน' 
        };
      } else {
        return {
          status: response.status,
          message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' 
        };
      }
    }
  } catch (error) {
    return {
      status: 0,
      message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' 
    };
  }
};

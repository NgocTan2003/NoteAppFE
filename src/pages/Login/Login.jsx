import React from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import { PasswordInput } from '../../components/Input/PasswordInput'
import { useState } from 'react'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Sai định dạng Email");
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setError(null);

    // Call API 
    try {
      const response = await axiosInstance.post("/login",
        {
          email: email,
          password: password
        }
      )

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Có lỗi xảy ra vui lòng thử lại");
      }
    }
  };

  return (
    <div>
      <Navbar />

      <div className='flex items-center justify-center mt-28 text-2xl'>
        <div>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>
            <input type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}></input>

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className='btn btn-primary' type='submit'>Login</button>

            {error && <p className='text-red-500 text-xs mt-4'>{error}</p>}

            <p className='text-sm text-center mt-4'>Bạn chưa có tài khoản? {" "}
              <Link to="/signUp" className="">Tạo tài khoản mới</Link>
            </p>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Login
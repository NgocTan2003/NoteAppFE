import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import { Navbar } from '../../components/Navbar/Navbar'
import { PasswordInput } from '../../components/Input/PasswordInput'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Name is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Error email format");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setError('');

    // Call API
    try {
      const response = await axiosInstance.post("/api/auth/create-account",
        {
          fullName: name,
          email: email,
          password: password
        }
      )

      if (response.data && response.data.error) {
        setError(response.data.message)
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Có lỗi xảy ra vui lòng thử lại");
      }
    }


  }
  return (
    <div>
      <Navbar />

      <div className='flex items-center justify-center mt-28 text-2xl'>
        <div>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>SignUp</h4>

            <input type='text'
              placeholder='Name'
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              value={name}
              onChange={(e) => setName(e.target.value)} />

            <input type='text'
              placeholder='Email'
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className='btn w-full text-sm bg-primary text-white p-2 rounded my-1 hover:bg-blue-600' type='submit'>Create Account</button>

            {error && <p className='text-red-500 text-xs mt-4'>{error}</p>}

            <p className='text-sm text-center mt-4'>Bạn đã có tài khoản? {" "}
              <Link to="/login" className="">Login</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
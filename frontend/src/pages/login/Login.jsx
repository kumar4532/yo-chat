import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

function Login() {

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(inputs);
  }

  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <h1 className='text-3xl font-semibold text-center text-gray-300'>Login
          <span className='text-blue-300'> Yooo!!!</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className='label p-2' htmlFor="">
              <span className='text-base label-text text-white'>Username</span>
            </label>
            <input
              type="text"
              placeholder='Enter Username'
              className='w-full input input-bordered h-10'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })} />
          </div>
          <div>
            <label className='label p-2' htmlFor="">
              <span className='text-base label-text text-white'>Password</span>
            </label>
            <input
              type="password"
              placeholder='Enter Password'
              className='w-full input input-bordered h-10'
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })} />
          </div>
          <Link to="/signup" className='text-sm hover:text-white mt-2 inline-block'>Don't have an account?</Link>
          <div>
            <button disabled={loading} className='btn btn-block btn-sm mt-2'>
              {
                loading ? <span className='loading loading-spinner'></span> : " Login"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login;
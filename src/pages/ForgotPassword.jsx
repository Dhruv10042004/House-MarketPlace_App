import React from 'react'
import {useState} from 'react'
import ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import {Link} from 'react-router-dom'
import {getAuth,sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
function ForgotPassword() {
  const [email,setEmail]=useState('')
  const onChange=(e)=>{
   setEmail(e.target.value)
  }
  const onSubmit=async (e)=>{
    e.preventDefault()
 try{
const auth=getAuth()
await sendPasswordResetEmail(auth,email)
toast.success('Email was sent')
 }
 catch(error)
 {
toast.error('could not send reset email')
 }
  }
  return (
    <div className='pageContainer'>
    <h1>Forgot Password</h1>
    <form onSubmit={onSubmit}>
    <input type="email" className='emailInput' placeholder='Email' id='email'value={email} onChange={onChange} />
    <Link to='/SignIn' className='forgotPasswordLink'>
        Sign In
      </Link>
      <div className="signInBar">
        <p className="signInText">
          Send Reset Link
        </p>
        <button className="signInButton">
          <img src={ArrowRightIcon} fill='#ffffff' width='34px'/>
        </button>
      </div>
    </form>
    </div>

  )
}

export default ForgotPassword
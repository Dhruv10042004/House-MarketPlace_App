import React from 'react'
import {toast} from 'react-toastify'
import { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import VisibilityIcon from '../assets/svg/visibilityIcon.svg'
import  ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg?keyboardArrowRightIcon'
import{getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import OAuth from '../components/OAuth'
function SignIn() {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData] = useState({
    email:'',
    password:''
  })
  const{email,password}=formData
  const navigate=useNavigate()
  const onchange=(e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))}
 const onSubmit=async(e)=>{
  e.preventDefault()
  try{
  const auth=getAuth()
  const userCredential=await signInWithEmailAndPassword(auth,email,password)
  
  if(userCredential.user)
  {
    toast.success("Successfully signed in")
    navigate('/')
  }
}
catch(error)
{
  toast.error('Bad User Credentials')
}
}
  return (
    <div className="pageContainer">
    <header>
      <p className="pageHeader">
        Welcome Back!
      </p>
    </header>
    <main>
      <form onSubmit={onSubmit}>
        <input type="email" className='emailInput' placeholder='Email' id='email' value={email} onChange={onchange}/>
      <div className='passwordInputDiv'>
      <input type={ showPassword ? 'text': 'password' } 
      className="passwordInput"
      id='password'
      value={password}
      onChange={onchange}
      placeholder='Password'
      />
      <img src={VisibilityIcon} alt="show password" 
      className='showPassword' 
      onClick={()=>setShowPassword((prevState)=>!prevState)}/>
      </div>
      <Link to='/ForgotPassword' className='forgotPasswordLink'>
        Forgot Password
      </Link>
      <div className="signInBar">
        <p className="signInText">
          Sign In
        </p>
        <button className="signInButton">
          <img src={ArrowRightIcon} fill='#ffffff' width='34px'/>
        </button>
      </div>
      </form>
      <OAuth />
      <Link to='/SignUp' className='registerLink'>Sign Up Instead</Link>
    </main>
    </div>
  )
}
export default SignIn
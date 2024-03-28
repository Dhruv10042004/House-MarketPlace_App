import React from 'react'
import { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import VisibilityIcon from '../assets/svg/visibilityIcon.svg'
import  ArrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg?keyboardArrowRightIcon'
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import {doc,setDoc,serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'
function SignUp() {
  const [showPassword,setShowPassword] = useState(false)
  const [formData,setFormData] = useState({
    name:'',
    email:'',
    password:''
  })
  const{name,email,password}=formData
  const navigate=useNavigate()
  const onchange=(e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]:e.target.value,
    }))}
    const onSubmit=async (e) => {
     e.preventDefault()
     try{
const auth=getAuth()
const userCredential=await createUserWithEmailAndPassword(auth,email,password)
const user=userCredential.user
updateProfile(auth.currentUser,{
  displayName:name
})
const formDataCopy={...formData}
delete formDataCopy.password
formDataCopy.timestamp=serverTimestamp()
await setDoc(doc(db,'users',user.uid),formDataCopy)
toast.success("Successfully Registered")
navigate('/')
     }
     catch(error)
     {
      toast.error('Bad Credentials')
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
        
      <input type="text" className='nameInput' placeholder='Name' id='name' value={name} onChange={onchange}/>
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
      <div className="signUpBar">
        <p className="signUpText">
          Sign Up
        </p>
        <button className="signUpButton">
          <img src={ArrowRightIcon} fill='#ffffff' width='34px'/>
        </button>
      </div>
      </form>
      <OAuth />
      <Link to='/SignIn' className='registerLink'>Sign In Instead</Link>
    </main>
    </div>
  )
}

export default SignUp
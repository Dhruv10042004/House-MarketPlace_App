import React from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import {getAuth,signInWithPopup,GoogleAuthProvider } from 'firebase/auth'
import {doc,setDoc,getDoc,serverTimestamp} from 'firebase/firestore'
import {db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'
function OAuth() {
    const navigate=useNavigate()
    const location =useLocation()
    const onGoogleClick=async(e)=>{
        try{
const auth=getAuth()
const provider=new GoogleAuthProvider()
const result=await signInWithPopup(auth,provider)
const user=result.user

const docRef=doc(db,'users',user.uid)
const docSnap=await getDoc(docRef)

if(!docSnap.exists())
{
    await setDoc(doc(db,'users',user.uid),{
        name:user.displayName,
        email:user.email,
        timestamp:serverTimestamp()
    })
}
navigate('/')
        }
        catch(error){
         toast.error('could not authorize with Google')
        }

    }
  return (
      <>
      <div className='socialLogin'>
        <p>Sign {location.pathname==='/SignIn'?'In':'Up'}</p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
      <img src={googleIcon} widht='36px' height='36px' />
        </button>
      </div>
    </>
  )
}

export default OAuth
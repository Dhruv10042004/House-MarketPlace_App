import React from 'react'
import {useEffect,useState,useRef} from 'react'
import {getAuth,onAuthStateChanged} from 'firebase/auth'    
export const useAuthStatus = () => {
    const isMounted=useRef(true)
    const [loggedIn,setloggedIn] = useState(false)
    const [checkingStatus,setCheckingStatus] = useState(true)
    useEffect(()=>{
        if(isMounted) {
            const auth=getAuth()
            onAuthStateChanged(auth,(user)=>{
                if(user)
                {
                    setloggedIn(true)
                }
                setCheckingStatus(false)
            })
        }
        return()=>{
            isMounted.current = false
        }
    },[isMounted])
  return {loggedIn,checkingStatus}
}


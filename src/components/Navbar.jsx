import React from 'react'
import {useNavigate,useLocation} from 'react-router-dom'

import OfferIcon  from '../assets/svg/localOfferIcon.svg'
import ExploreIcon from '../assets/svg/exploreIcon.svg'
import  PersonOutlineIcon  from '../assets/svg/personOutlineIcon.svg'
function Navbar() {
    const navigate=useNavigate()
    const location=useLocation()
    const pathMatchRoute=(route)=>{
        if(route==location.pathname)
        {
            return true;
        }
    }
  return (
    <footer className='navbar'>
        <nav className='navbarNav'>
            <ul className='navbarListItems'>
            <li className='navbarListItem' onClick={()=>navigate('/')}>
                <img src={ExploreIcon} fill={pathMatchRoute('/')?'#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                <p className={pathMatchRoute('/')?'#2c2c2c':'#8f8f8f'}>Explore</p>
            </li>
            <li className='navbarListItem'  onClick={()=>{navigate('/Offers')}}>
                <img src={OfferIcon} fill={pathMatchRoute('/Offers')?'#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                <p className={pathMatchRoute('/')?'#2c2c2c':'#8f8f8f'}>Offers</p>
            </li>
            <li className='navbarListItem' onClick={()=>{navigate('/Profile')}}>
                <img src={PersonOutlineIcon} fill={pathMatchRoute('/Profile')?'#2c2c2c':'#8f8f8f'} width='36px' height='36px' />
                <p className={pathMatchRoute('/')?'#2c2c2c':'#8f8f8f'}>Profile</p>
            </li>
            </ul>
        </nav>
    </footer>
  )
}

export default Navbar
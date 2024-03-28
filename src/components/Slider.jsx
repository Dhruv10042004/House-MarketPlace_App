import React from 'react'
import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {collection,getDocs,query,orderBy ,limit} from 'firebase/firestore'
import {db} from '../firebase.config'
import SwiperCore from 'swiper'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css'
import {Swiper,SwiperSlide} from 'swiper/react'
import Spinner from './Spinner'
SwiperCore.use([Navigation,Pagination,Scrollbar,A11y])
function Slider() {
    const [loading,setLoading]=useState(true)
    const [listings,setListings]=useState(null)

    const navigate=useNavigate()
    useEffect(()=>{
        const fetchListings=async ()=>{

            const listingsRef=collection(db,'listings')
            const q=query(listingsRef,orderBy('timestamp','desc'),limit(5))
            const querySnap= await getDocs(q)
            const listings=[]
            querySnap.forEach((doc)=>{
                  return listings.push({
                    id:doc.id,
                    data:doc.data()
                  })
            })
            setListings(listings)
            console.log(listings)
            setLoading(false)
        }
        fetchListings()
    },[])
   if(loading) {
    return <Spinner />
   }
  return (
    <>

    <Swiper slidesPerView={1} pagination={{clickable: true}}>
        {listings.map(({data,id}) => (
         <SwiperSlide key={id}  onClick={()=>{
          navigate(`/category/${data.type}/${id}`)  
         }}>
            <div 
            style={{
                background:`url(${data.imageUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
            }}
            className="swiper-container">
            <p className="swiperSlideText">
                {data.name}
            </p>
            <p className="swiperSlidePrice">
                ${data.discountedPrice ??dataregularPrice }
                {data.type==='rent' &&'/month'}
            </p>
            </div>
         </SwiperSlide>
        ))}
        </Swiper></>
  )
}

export default Slider
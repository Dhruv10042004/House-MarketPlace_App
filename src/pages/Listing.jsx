import React from 'react'
import {useState,useEffect} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {getDoc,doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {MapContainer ,Marker,Popup,TileLayer} from 'react-leaflet'
import SwiperCore from 'swiper'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css'
import {Swiper,SwiperSlide} from 'swiper/react'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Helmet } from 'react-helmet'
SwiperCore.use([Navigation,Pagination,Scrollbar,A11y])
function Listing() {
 const [listing,setListing]=useState(null)
 const [loading,setLoading]=useState(true)
 const [shareLinkCopied,setShareLinkCopied]=useState(null)
 const navigate=useNavigate()
 const params=useParams()
 const auth=getAuth()
 useEffect(()=>{
    const fetchListing=async()=>{
const docRef=doc(db,'listings',params.listingId)
const docSnap=await getDoc(docRef)
if(docSnap.exists())
{
    console.log(docSnap.data())
    setListing(docSnap.data())
    setLoading(false)
}
    }
    fetchListing()
 },[navigate,params.listingId]) 
 if(loading)
 {
    return <Spinner />
 }
 return (
    <main>
        <Helmet>
        <title>{listing.name}</title>
      </Helmet>
      <Swiper spacebetween={50} slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className='swiper-container'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

        <div className="shareIconDiv" onClick={()=>{
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(()=>{
                setShareLinkCopied(false)
            },2000)

        }}>
            <img src={shareIcon} alt="" />
        </div>
        {shareLinkCopied&&<p className='linkCopied'>Link Copied!</p>}
        <div className="listingDetails">
            <p className="listingName">{listing.name}
            -${listing.offer?listing.discountedPrice:listing.regularPrice}
            </p>
            <p className='listingLocation'>{listing.location}</p>

            <p className='listingType'>For{listing.type==='rent'?' Rent':'Sale'}
            </p>
            {listing.offer &&(<p className='discountPrice'>
                ${listing.regularPrice-listing.discountedPrice}
            </p>)}
            <ul className='listingDetailsList'>
                <li>{listing.bedrooms} Bedrooms</li>
                <li>{listing.bathrooms} Bathrooms</li>
                <li>{listing.parking&&'Parking Spot'}</li>
                <li>{listing.furnished&&'Furnished'}</li>
            </ul>
            <p className="listingLocationTitle">Location</p>

<div className="leafletContainer">
    <MapContainer style={{
        height:'100%',
        width:'100%'}}
    center={[listing.latitude,listing.longitude]}
    zoom={13}
    scrollWheelZoom={false}
    >
    <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />
    <Marker position={[listing.latitude,listing.longitude]}>

        <Popup>{listing.location}</Popup>
    </Marker>
    </MapContainer>
</div>

            {auth.currentUser?.uid!==listing.userRef &&(
                <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
                    Contact Landlord
                </Link>
            )}
        </div>
    </main>
  )
}

export default Listing
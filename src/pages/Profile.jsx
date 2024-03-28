import React from 'react'
import {useState,useEffect} from 'react'
import {getAuth,updateProfile} from 'firebase/auth'
import {useNavigate,Link} from 'react-router-dom'
import {updateDoc,doc,getDocs,collection,query,where,orderBy,limit,deleteDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'
function Profile() {
  const auth=getAuth()
  const [loading,setLoading]=useState(true)
  const [listings,setListings]=useState(null)
  const [changeDetails,setChangeDetails]=useState(false)
  const [formData,setFormData] = useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email,
  })  
  const {name,email}=formData
  const navigate=useNavigate()
  const onLogOut=()=>{
    auth.signOut()
    setFormData({
      name:'',
      email:''
    })
    navigate('/SignIn')
  }
  useEffect(()=>{
    const fetchUserListings=async()=>{
      const docRef=collection(db,'listings')
      const q=query(docRef,
        where('userRef','==',auth.currentUser.uid),
        orderBy('timestamp','desc'),
        limit(5))
      const querySnap=await getDocs(q)

      let listings=[]
      querySnap.forEach((listing)=>{
        return listings.push({
          id:listing.id,
          data:listing.data()
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  },[auth.currentUser.uid])
  const onSubmit=async ()=>{
    try{
if(auth.currentUser.displayName!==name)
{
await updateProfile(auth.currentUser,{
  displayName:name
})


const userRef=doc(db,'users',auth.currentUser.uid)
await updateDoc(userRef,{
  name,
})
}
    }
    catch(error)
    {
toast.error('Could not update the Profile Details')
    }
  }
  const onChange=(e)=>{
    setFormData((prevState)=>(
      {
        ...prevState,
        [e.target.id]:e.target.value
      }
    ))
  }
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }
  const onEdit =(listingId) => {navigate(`/edit-listing/${listingId}`)}

  return <>
  <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">
        MyProfile
      </p>
      <button type="button" className="logOut" onClick={onLogOut}>Logout</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailText">
          Personal Details
        </p>
        <p className="changePersonalDetails" onClick={()=>{
          changeDetails && onSubmit()
          setChangeDetails((prevState)=>!prevState)
        }}>
          {changeDetails? 'done' : 'change' }
        </p>
      </div>
      <div className="profileCard">
        <form>
          <input type="text" id='name' 
          className={!changeDetails ?'profileName':'profileNameActive'} 
          value={name} disabled={!changeDetails} onChange={onChange}/>
          <input type="text" id='email' 
          className={!changeDetails ?'profileEmail':'profileEmailActive'} 
          value={email} disabled={!changeDetails} onChange={onChange}/>
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt="home" />
        <p>Sell or rent your home</p>
        <img src={arrowRight} alt="" />
      </Link>
      {!loading && listings?.length>0 && (
        <>
        
        <div className="listingContainer">
          <p className='listingText'>Your Listings</p>
          <ul className='listingsList'>  
          {
            listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing} onDelete={()=>onDelete(listing.id)} 
              onEdit={()=>onEdit(listing.id)}
              />
            ))
          }
          </ul>
        </div>
        </>
      )}
    </main>
  </div>
  </>
}

export default Profile
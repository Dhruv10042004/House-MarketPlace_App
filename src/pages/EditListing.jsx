import React from 'react'
import {useState ,useEffect,useRef} from 'react'
import {getAuth,onAuthStateChanged} from 'firebase/auth'
import{
getStorage,
ref,
uploadBytesResumable,
getDownloadURL
}
from 'firebase/storage'
import {serverTimestamp,doc,updateDoc,getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {v4 as uuidv4} from 'uuid'
import {useNavigate,useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'
function EditListing() {
    const [geoLocationEnabled,setGeoLocationEnabled] = useState(true)
    const [loading,setLoading]=useState(false)
    const[listing,setListing]=useState(null)
    const [formData,setFormData]=useState({
        type:'rent',
        name:'',
        bedrooms:1,
        bathrooms:1,
        parking:false,
        furnished:false,
        location:'',
        offer:false,
        regularPrice:0,
        discountedPrice:0,
        images:{},
        latitude:0,
        longitude:0,
    })
    const params=useParams()
    const{type,name,bedrooms,bathrooms,parking,furnished,location,offer,regularPrice,discountedPrice,
        images,latitude,longitude
        }=formData
        const auth=getAuth()
        const navigate=useNavigate()
        const isMounted=useRef()
useEffect(()=>{
setLoading(true)
const fetchListings=async()=>{
    
        const docRef=doc(db,'listings',params.listingId)
        const docSnap=await getDoc(docRef)
        if(docSnap.exists())
        {
            setListing(docSnap.data())
            setFormData({...docSnap.data()}) 
            setLoading(false)
        }
        else
        {
            navigate('/')
            toast.error('List does not exists')
        }
}
fetchListings()
},[])


useEffect(()=>{
    if(listing&&listing.userRef!==auth.currentUser.uid)
    {
        toast.error('You cannot edit that listing')
        navigate('/')
    }
})
    useEffect(()=>{
        if(isMounted)
        {
onAuthStateChanged(auth,(user)=>{
    if(user)
    setFormData({...formData,userRef:user.uid})
    else
    {
        navigate('/SignIn')
    }
})
}
        return ()=>{
            isMounted.current=false
        }
    },[isMounted])
if(loading)
{
    <Spinner />
}
const onSubmit=async (e)=>{
    e.preventDefault()
    if(discountedPrice>=regularPrice)
    toast.error('Discounted Price needs to be less than regular price')
    if(images.length>6){
        setLoading(false)
toast.error('Max 6 Images')
return 
    }
    let gelocation={}
    gelocation.lat=latitude
    gelocation.lng=longitude 

    //Store image in firebase
    const storeImage=async(image)=>{
        return new Promise((resolve, reject)=>{
        const storage=getStorage()
        const filename=`${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef=ref(storage,'images/'+filename)
        const uploadTask=uploadBytesResumable(storageRef,image)
        uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused': 
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
  }, 
  () => {
    
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
    });
});
})   
}
const imageUrls=await Promise.all(
    [...images].map((image)=>storeImage(image))
).catch(()=>{
    setLoading(false)
    toast.error('Images not uploaded')
    return
})
const formDataCopy={
    ...formData,
    imageUrls,
    timestamp:serverTimestamp(),
    gelocation,
}
delete formDataCopy.images
delete formDataCopy.address
!formDataCopy.offer&&delete formDataCopy.DiscountedPrice
console.log(formDataCopy)
const docRef=doc(db,'listings',params.listingId)
await updateDoc(docRef,formDataCopy)
setLoading(false)
toast.success('Saved Listings')
navigate(`/category/${formDataCopy.type}/${docRef.id}`)
}
const onMutate=(e)=>{
    const { id, value, type } = e.target;
    let booleanValue = null;
  
    if (type === 'file') {
      // Handling file uploads
      setFormData((prevState) => ({
        ...prevState,
        [id]: e.target.files
      }));
      return;
    }
  
    // Handling boolean values
    if (value === 'true' || value === 'false') {
      booleanValue = value === 'true';
    }
  
    setFormData((prevState) => ({
      ...prevState,
      [id]: booleanValue !== null ? booleanValue : value
    }));
 }
    return (
    <div className='profile'>
        <header>
            <p className="pageHeader">Edit a Listing</p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
            <label className='formLabel'>Sell/Rent</label>
            <div className="formButtons">
                <button type='button'
                className={type==='sale'?'formButtonActive':'formButton'}
                id='type'
                value='sale'
                onClick={onMutate}
                >Sell</button>
                <button type='button'
                className={type==='rent'?'formButtonActive':'formButton'}
                id='type'
                value='rent'
                onClick={onMutate}
                >Rent</button>
            </div>
            <label className='formLabel'>Name</label>
            <input 
            className='formInputName'
            type="text" 
            onChange={onMutate}
            value={name}
            id='name'
            maxLength='32'
            minLength='10'
            required
            />
            <div className='formRooms flex'>
                <div>
                    <label className='formLabel'>Bedrooms</label>
                    <input 
                    type='number'
                    className='formInputSmall'
                    id='bedrooms'
                    value={bedrooms}
                    onChange={onMutate}
                    min='1'
                    max='50'
                    required />
                </div>
                <div>
                <label className='formLabel'>Bathrooms</label>
                    <input 
                    type='number'
                    className='formInputSmall'
                    id='bathrooms'
                    onChange={onMutate}
                    value={bathrooms}
                    min='1'
                    max='50'
                    required />
                </div>
            </div>
            <label className='formLabel'>Parking spot</label>
            <div className='formButtons'>
            <button type='button'
                className={parking?'formButtonActive':'formButton'}
                id='parking'
                value={true}
                onClick={onMutate}
                >Yes</button>
                <button type='button'
                className={!parking&&parking!==null?'formButtonActive':'formButton'}
                id='parking'
                value={false}
                onClick={onMutate}
                >No</button>
            </div>
            <label className='formLabel'>Furnished</label>
            <div className='formButtons'>
            <button type='button'
                className={furnished?'formButtonActive':'formButton'}
                id='furnished'
                value={true}
                onClick={onMutate}
                >Yes</button>
                <button type='button'
                className={!furnished?'formButtonActive':'formButton'}
                id='furnished'
                value={false}
                onClick={onMutate}
                >No</button>
            </div>
            <label className='formLabel'>Address</label>
            <textarea type='text'
            className='formInputAddress' 
            id='location'
            value={location}
            onChange={onMutate}
            required
            />
            
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
            <label className='formLabel'>Offer</label>
            <div className='formButtons'>
            <button type='button'
                className={offer&&offer!==null?'formButtonActive':'formButton'}
                id='offer'
                value={true}
                onClick={onMutate}
                >Yes</button>
                <button type='button'
                className={!offer&&offer!==null?'formButtonActive':'formButton'}
                id='offer'
                value={false}
                onClick={onMutate}
                >No</button>
            </div>
            <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Edit Listing
          </button>
            </form>
        </main>
    </div>
  )
}

export default EditListing
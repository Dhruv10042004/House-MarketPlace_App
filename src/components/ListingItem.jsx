import React from 'react'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import DeleteIcon from '../assets/svg/deleteIcon.svg'
import EditIcon from '../assets/svg/editIcon.svg'
import { Link } from 'react-router-dom'
function ListingItem({ listing, onDelete,onEdit }) { // Moved onDelete inside curly braces
  return (
    <li className="categoryListing">
      <Link to={`/category/${listing.data.type}/${listing.id}`} className='categoryListingLink'>
        <img src={listing.data.imageUrls[0]} alt="" className="categoryListingImg" />
        <div className="categoryListingDetails">
          <p className='categoryListingLocation'>{listing.data.location}</p>
          <h2 className='categoryListingName'>{listing.data.name}</h2>
          <h2 className='categoryListingPrice'>${!listing.data.offer ? listing.data.regularPrice : listing.data.discountedPrice}/ Month</h2>
          <div className='categoryListingInfoDiv'>
            <img src={bedIcon} alt="" />
            <p className='categoryListingInfoText'>
              {listing.data.bedrooms} Bedrooms
            </p>
            <img src={bathtubIcon} alt="" />
            <p className='categoryListingInfoText'>
              {listing.data.bathrooms} Bathrooms
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <img src={DeleteIcon}
          className='removeIcon'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
       {onEdit&&<img src={EditIcon} className='editIcon' onClick={() => onEdit(listing.id)} />}
    </li>
  )
}
export default ListingItem

import React from 'react'
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from '../components/Slider'
function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">
          Explore
        </p>
      </header>
      <main>
        <Slider />
        <p className='exploreCategoryHeading'>Categories</p>
        <div className="exploreCategories">
          <Link to='/Category/rent'>
            <img src={rentCategoryImage} alt="" className='exploreCategoryImg'/>
          <p className="exploreCategoryName">Places For Rent</p>
          </Link>
          <Link to='/Category/sale'>
            <img src={sellCategoryImage} alt="" className='exploreCategoryImg'/>
            <p className="exploreCategoryName">Places For Sell</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore
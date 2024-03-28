import React from 'react'
import { BrowserRouter as Router,Routes,Route} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Explore from './pages/Explore'
import PrivateRoute from "./components/PrivateRoute"
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Navbar from "./components/Navbar"
import Category from "./pages/Category"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import Listing from "./pages/Listing"
import Contact from "./pages/Contact"
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Explore />} />
        <Route path='/Offers' element={<Offers />} />
        <Route path='/Category/:CategoryName' element={<Category />} />
        <Route path='/Profile' element={<PrivateRoute />}>
        <Route path='/Profile' element={<Profile />} />
        </Route>
        <Route path='/SignIn' element={<SignIn />} />
        <Route path='/SignUp' element={<SignUp />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/edit-listing/:listingId' element={<EditListing />} />
        <Route path='/category/:categoryName/:listingId' element={<Listing />} />
        <Route path='/contact/:landlordId' element={<Contact />} />
      </Routes>
      <Navbar />
    </Router>
    <ToastContainer />
    </>
  )
}
export default App

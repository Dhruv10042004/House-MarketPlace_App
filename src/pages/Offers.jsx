import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    collection, getDocs, query, where, orderBy, limit
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListings,setLastFetchedListings] = useState(null)
    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, 'listings');
                const q = query(
                    listingsRef,
                    where('offer', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );
                const querySnap = await getDocs(q);
                const lastVisible=querySnap.docs[querySnap.docs.length-1]
                const fetchedListings = [];
                querySnap.forEach((doc) => {
                    fetchedListings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                    
                });
                setListings(fetchedListings);
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchListings();
    });
    const OnfetchListings = async () => {
        try {
            const listingsRef = collection(db, 'listings');
            const q = query(
                listingsRef,
                where('offer', '==', true),
                orderBy('timestamp', 'desc'),
                limit(10)
            );
            const querySnap = await getDocs(q);
            const fetchedListings = [];
            querySnap.forEach((doc) => {
                fetchedListings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(fetchedListings);
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
        }
    };
    return (
        <div className='category'>
            <header>
                <p className="pageHeader">
Offers
                </p>
            </header>
            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <main>
                    <ul className="categoryListings">
                        {listings.map((listing) => (
                            <ListingItem key={listing.id} listing={listing} />
                        // <h3 key={listing.id}>{listing.data.name}</h3>
                        ))}
                    </ul>
                </main>
            ) : (
                <p>There are no current Offers</p>
            )}
        </div>
    );
}

export default Offers;

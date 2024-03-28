import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    collection, getDocs, query, where, orderBy, limit, startAfter
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Category() {
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
                    where('type', '==', params.CategoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );
                const querySnap = await getDocs(q);

                const lastVisible=querySnap.docs[querySnap.docs.length-1]
                setLastFetchedListings(lastVisible)
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
    }, [params.CategoryName]);

    const onFetchMoreListings = async () => {
        try {
            const listingsRef = collection(db, 'listings');
            const q = query(
                listingsRef,
                where('type', '==', params.CategoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListings),
                limit(10)
            );
            const querySnap = await getDocs(q);

            const lastVisible=querySnap.docs[querySnap.docs.length-1]
            setLastFetchedListings(lastVisible)
            const fetchedListings = [];
            querySnap.forEach((doc) => {
                fetchedListings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings((prevState)=>[...prevState,...fetchedListings]);
            setLoading(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className='category'>
            <header>
                <p className="pageHeader">
                    {params.CategoryName === 'rent' ? 'Places for Rent' : 'Places for Sale'}
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
                    <button className='primaryButton' onClick={onFetchMoreListings}>Load More</button>
                </main>
            ) : (
                <p>No Listings for {params.CategoryName}</p>
            )}
        </div>
    );
}

export default Category;

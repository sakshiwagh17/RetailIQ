
import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import axios from '../lib/axios'


const Home = () => {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/shops/getShop')
        
        if (response.status === 200) {
          const shopsData = response.data.data || []
          let finalShops = Array.isArray(shopsData) ? shopsData : [shopsData]
          
          // Flatten nested arrays if backend returns nested structure
          if (finalShops.length > 0 && Array.isArray(finalShops[0])) {
            finalShops = finalShops.flat()
          }
          
          console.log('Processed shops data:', finalShops)
          console.log('Number of shops:', finalShops.length)
          setShops(finalShops)
        }
      } catch (error) {
        console.error('Error fetching shops:', error)
        setError('Failed to load shops. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-12">
          {/* Main Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-green-600">RetailIQ</span>
            </h1>
            
            {/* Tagline */}
            <div className="mb-8">
              <p className="text-xl md:text-2xl text-gray-700 font-medium mb-4">
                "Your Local Business, Our Community's Voice"
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Discover authentic reviews, rate your experiences, and help your community find the best local businesses. 
                From street food to services - every opinion matters.
              </p>
            </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Local Businesses
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore top-rated businesses in your area, handpicked by our community
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {loading ? (
            // Loading skeleton
            <>
              <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </>
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !shops || shops.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No shops available yet.</p>
              <p className="text-gray-500 mt-2">Be the first to register your shop!</p>
            </div>
          ) : (
            // Render actual shop cards
            shops.map((shop) => (
              <Card 
                key={shop.id} 
                shopData={shop}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

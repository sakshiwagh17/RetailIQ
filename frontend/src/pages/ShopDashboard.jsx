import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ShopDashboard = () => {
  const [shopData, setShopData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true)
        const response = await axios.post('/shops/storesratings')
        
        if (response.status === 200) {
          setShopData(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching shop data:', error)
        if (error.response?.status === 401) {
          setError('Please log in to view your shop dashboard')
        } else {
          setError('Failed to load shop data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchShopData()
  }, [])

  const calculateAverageRating = (raters) => {
    if (!raters || raters.length === 0) return 0
    const total = raters.reduce((sum, rater) => sum + rater.rating, 0)
    return (total / raters.length).toFixed(2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const averageRating = calculateAverageRating(shopData?.shopRaters)
  const totalRaters = shopData?.shopRaters?.length || 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Shop Dashboard
          </h1>
          <p className="text-gray-600">View your shop's performance</p>
        </div>

        {/* Shop Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Shop Name */}
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Shop Name</p>
            <p className="text-lg font-semibold text-gray-900">{shopData?.shopName}</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-lg font-semibold text-gray-900">
              {averageRating > 0 ? `${averageRating}/5` : 'No ratings'}
            </p>
          </div>

          {/* Total Reviews */}
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600">Total Reviews</p>
            <p className="text-lg font-semibold text-gray-900">{totalRaters}</p>
          </div>
        </div>

        {/* Ratings Table */}
        <div className="bg-white rounded shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
          </div>
          
          {totalRaters === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shopData.shopRaters.map((rater, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{rater.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{rater.rating}/5</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopDashboard
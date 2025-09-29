

import React, { useState, useEffect } from 'react'
import axiosInstance from '../lib/axios'

const AdminDashboard = () => {
  const [counts, setCounts] = useState(null)
  const [userStoreData, setUserStoreData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true)
        
        // Fetch counts
        const countsResponse = await axiosInstance.get('/admin/getCounts')
        if (countsResponse.status === 200) {
          setCounts(countsResponse.data.data)
        }

        // Fetch users and stores
        const usersResponse = await axiosInstance.get('/admin/getusers')
        if (usersResponse.status === 200) {
          setUserStoreData(usersResponse.data.data)
        }
        
      } catch (error) {
        console.error('Error fetching admin data:', error)
        if (error.response?.status === 401) {
          setError('Please log in as admin to view this dashboard')
        } else {
          setError('Failed to load admin data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
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
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Overview of platform statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* User Count */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-sm text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{counts?.userCount || 0}</p>
          </div>

          {/* Store Count */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-sm text-gray-600 mb-2">Total Stores</h3>
            <p className="text-3xl font-bold text-green-600">{counts?.storeCount || 0}</p>
          </div>

          {/* Rating Count */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-sm text-gray-600 mb-2">Total Ratings</h3>
            <p className="text-3xl font-bold text-yellow-600">{counts?.ratingCount || 0}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded shadow mb-8">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          </div>
          
          {!userStoreData?.userStats || userStoreData.userStats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userStoreData.userStats.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{user.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'store_owner' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stores Table */}
        <div className="bg-white rounded shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">All Stores</h2>
          </div>
          
          {!userStoreData?.storeStats || userStoreData.storeStats.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No stores found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Store Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Average Rating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userStoreData.storeStats.map((store, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{store.store_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{store.owner_name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{store.avg_rating}/5</p>
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

export default AdminDashboard

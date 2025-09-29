import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, MapPin } from 'lucide-react'
import axios from 'axios'

const RegisterShop = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    shopName: '',
    shopAddress: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required'
    } else if (formData.shopName.trim().length < 2) {
      newErrors.shopName = 'Shop name must be at least 2 characters'
    }
    
    if (!formData.shopAddress.trim()) {
      newErrors.shopAddress = 'Shop address is required'
    } else if (formData.shopAddress.trim().length < 5) {
      newErrors.shopAddress = 'Shop address must be at least 5 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true)
      try {
        const response = await axios.post('/shops/register', {
          shopName: formData.shopName,
          shopAddress: formData.shopAddress
        })
        
        console.log('Shop registration successful:', response.data)
        alert('Shop registered successfully!')
        
        // Clear form data
        setFormData({
          shopName: '',
          shopAddress: ''
        })
        
        navigate('/')
        
      } catch (error) {
        console.error('Shop registration error:', error)
        if (error.response?.status === 400) {
          alert(error.response.data.message || 'Registration failed')
        } else if (error.response?.status === 401) {
          alert('Please log in first to register a shop')
          navigate('/login')
        } else {
          alert('Something went wrong. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Register Your Shop
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join RetailIQ and start showcasing your business
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
            
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="shopName"
                    name="shopName"
                    type="text"
                    value={formData.shopName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.shopName ? 'border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
                    placeholder="Enter your shop name"
                  />
                </div>
                {errors.shopName && (
                  <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
                )}
              </div>

              <div>
                <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="shopAddress"
                    name="shopAddress"
                    rows="3"
                    value={formData.shopAddress}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.shopAddress ? 'border-red-500' : 'border-gray-300'} rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none`}
                    placeholder="Enter your complete shop address"
                  />
                </div>
                {errors.shopAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.shopAddress}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
              >
                {isLoading ? 'Registering Shop...' : 'Register Shop'}
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Want to go back?{' '}
              <Link 
                to="/" 
                className="font-medium text-green-600 hover:text-green-500 transition-colors">
                Return to Home
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterShop
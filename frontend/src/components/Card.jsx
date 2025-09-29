import axios from "axios"
import { useEffect, useState } from "react"

const StarRating = ({ rating, onRatingChange }) => (
  <div className="flex justify-center space-x-1 my-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onRatingChange(star)}
        className={`text-2xl ${
          star <= rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        ★
      </button>
    ))}
  </div>
)

export const Card = ({ shopData }) => {
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRatingInput, setShowRatingInput] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [loadingAvgRating, setLoadingAvgRating] = useState(true)

  const fetchAverageRating = async () => {
    try {
      setLoadingAvgRating(true)
      const response = await axios.post('/api/stores/storesratings', {
        shopId: shopData.id,
      })
      if (response.status === 200) {
        const shopRating = response.data.data?.avg || 0
        setAverageRating(Number(shopRating.toFixed(1)))
      }
    } catch (error) {
      console.error('Error fetching average rating:', error)
      setAverageRating(0)
    } finally {
      setLoadingAvgRating(false)
    }
  }

  useEffect(() => {
    if (shopData?.id) {
      fetchAverageRating()
    }
  }, [shopData?.id])

  const handleAddRating = async () => {
    if (rating === 0) {
      alert('Please select a rating first!')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post('/api/ratings/addRating', {
        rating,
        shopId: shopData.id,
      })

      if (response.status === 200) {
        alert(response.data.message || 'Rating added successfully!')
        setShowRatingInput(false)
        setRating(0)
        await fetchAverageRating()
      }
    } catch (error) {
      console.error('Error adding rating:', error)
      alert(error.response?.data?.message || 'Failed to add rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="card-body flex flex-col justify-between border-2 p-6 border-amber-600 rounded-2xl w-72 h-80 text-center bg-amber-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-800">{shopData.name}</p>
          <p className="text-md text-gray-600">{shopData.address}</p>
        </div>

        <p className="text-lg font-bold text-amber-700">
          {loadingAvgRating
            ? 'Loading rating...'
            : averageRating > 0
            ? `Average Rating - ${averageRating} / 5`
            : 'No ratings yet'}
        </p>

        {showRatingInput && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Select your rating:</p>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
        )}

        <div className="space-y-2">
          {!showRatingInput ? (
            <button
              onClick={() => setShowRatingInput(true)}
              disabled={loadingAvgRating}
              className="w-full border-2 border-amber-600 bg-amber-600 text-white rounded-xl py-2 px-4 font-medium hover:bg-amber-700 hover:border-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Rating
            </button>
          ) : (
            <>
              <button
                onClick={handleAddRating}
                disabled={isSubmitting || rating === 0}
                className={`w-full border-2 border-green-600 bg-green-600 text-white rounded-xl py-2 px-4 font-medium hover:bg-green-700 hover:border-green-700 transition-colors duration-200 ${
                  (isSubmitting || rating === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </button>
              <button
                onClick={() => {
                  setShowRatingInput(false)
                  setRating(0)
                }}
                className="w-full border-2 border-gray-600 text-gray-600 rounded-xl py-2 px-4 font-medium hover:bg-gray-600 hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

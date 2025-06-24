import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Mock Button component for environment compatibility
const Button = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${className}`}
  >
    {children}
  </button>
)

const TripDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { travelPlan } = location.state || {} // Get travelPlan from navigation state

  // Handle case where no travel plan data is found (e.g., direct access)
  if (!travelPlan) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-3 font-sans'>
        <div className='bg-white p-6 rounded-lg shadow-xl max-w-lg w-full text-center'>
          <h2 className='text-xl font-bold text-red-600 mb-4'>
            No Trip Plan Found!
          </h2>
          <p className='text-gray-700 mb-6'>
            Please generate a trip plan first.
          </p>
          <Button
            onClick={() => navigate('/create-trip')}
            className='bg-blue-500 hover:bg-blue-600'
          >
            Go Back to Plan Trip
          </Button>
        </div>
      </div>
    )
  }

  const handleGoBack = () => {
    navigate('/create-trip') // Navigate back to the main form page
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-3 font-sans'>
      <div className='bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full'>
        <div className='flex justify-end mb-4'>
          <Button
            onClick={handleGoBack}
            className='bg-blue-500 hover:bg-blue-600'
          >
            Go Back to the Form
          </Button>
        </div>
        <h1 className='text-3xl font-bold text-gray-800 mb-4 text-center'>
          {travelPlan.location} - {travelPlan.tripDuration}
        </h1>
        <p className='text-gray-600 mb-4 text-center'>
          For {travelPlan.travelers}
        </p>

        {travelPlan.imageURL && (
          <img
            src={travelPlan.imageURL}
            alt={travelPlan.location}
            className='w-full h-64 object-cover rounded-lg mb-4 shadow-md'
          />
        )}

        <p className='text-gray-700 mb-6'>{travelPlan.description}</p>

        {travelPlan.hikingOptions && travelPlan.hikingOptions.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
              Hiking Options
            </h2>
            <ul className='list-disc list-inside text-gray-700'>
              {travelPlan.hikingOptions.map((option, index) => (
                <li key={index} className='mb-2'>
                  <strong>{option.trailName}</strong> ({option.difficulty}):{' '}
                  {option.description}
                  {option.distance && (
                    <span> - Distance: {option.distance}</span>
                  )}
                  {option.duration && (
                    <span> - Duration: {option.duration}</span>
                  )}
                  {option.ticketPricing && (
                    <span> - Price: {option.ticketPricing}</span>
                  )}
                  {option.permit && <span> - Permit: {option.permit}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {travelPlan.campingOptionsNearby &&
          travelPlan.campingOptionsNearby.length > 0 && (
            <div className='mb-6'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
                Camping Options Nearby
              </h2>
              <ul className='list-disc list-inside text-gray-700'>
                {travelPlan.campingOptionsNearby.map((option, index) => (
                  <li key={index} className='mb-2'>
                    <strong>{option.campgroundName}</strong>:{' '}
                    {option.description}
                    {option.pricePerNight && (
                      <span> - Price: {option.pricePerNight}</span>
                    )}
                    {option.distanceFromPark && (
                      <span> - Distance: {option.distanceFromPark}</span>
                    )}
                    {option.reservations &&
                    option.reservations.startsWith('http') ? (
                      <span>
                        {' '}
                        -{' '}
                        <a
                          href={option.reservations}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-500 hover:underline'
                        >
                          Reservations
                        </a>
                      </span>
                    ) : (
                      <span> - Reservations: {option.reservations}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {travelPlan.itinerary && travelPlan.itinerary.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
              Itinerary
            </h2>
            {travelPlan.itinerary.map((dayPlan, dayIndex) => (
              <div
                key={dayIndex}
                className='mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50'
              >
                <h3 className='text-xl font-bold text-gray-700 mb-2 capitalize'>
                  Day {dayPlan.dayNumber || dayIndex + 1}: {dayPlan.theme}
                </h3>
                <p className='text-sm text-gray-600 mb-3'>
                  Best Time: {dayPlan.bestTimeToVisit}
                </p>
                {dayPlan.plan && dayPlan.plan.length > 0 && (
                  <ul className='space-y-4'>
                    {dayPlan.plan.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className='p-3 bg-white rounded-md shadow-sm'
                      >
                        <h4 className='font-semibold text-lg text-gray-800'>
                          {item.placeName} ({item.time})
                        </h4>
                        {item.placeImageURL && (
                          <img
                            src={item.placeImageURL}
                            alt={item.placeName}
                            className='w-full h-32 object-cover rounded-md mt-2 mb-2'
                          />
                        )}
                        <p className='text-gray-700 text-sm'>
                          {item.placeDetails}
                        </p>
                        <ul className='text-xs text-gray-600 mt-2'>
                          {item.ticketPricing && (
                            <li>Price: {item.ticketPricing}</li>
                          )}
                          {item.rating && <li>Rating: {item.rating} / 5</li>}
                          {item.hikingOptions &&
                            item.hikingOptions.length > 0 && (
                              <li>Hiking: {item.hikingOptions.join(', ')}</li>
                            )}
                          {item.campingOptions &&
                            item.campingOptions.length > 0 && (
                              <li>Camping: {item.campingOptions.join(', ')}</li>
                            )}
                          {item.hotelOptions && (
                            <li>Hotels: {item.hotelOptions}</li>
                          )}
                          {item.geoCoordinates && (
                            <li>
                              Lat: {item.geoCoordinates.latitude}, Lng:{' '}
                              {item.geoCoordinates.longitude}
                            </li>
                          )}
                        </ul>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {travelPlan.budgetTips && travelPlan.budgetTips.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
              Budget Tips
            </h2>
            <ul className='list-disc list-inside text-gray-700'>
              {travelPlan.budgetTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {travelPlan.importantNotes && travelPlan.importantNotes.length > 0 && (
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
              Important Notes
            </h2>
            <ul className='list-disc list-inside text-gray-700'>
              {travelPlan.importantNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetails

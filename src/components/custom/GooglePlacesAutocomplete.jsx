import React, { useState, useRef, useEffect, useCallback } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import {
  InterestsOptionsList,
  SelectBudgetOptions,
  SelectTravelersList
} from '../../constants/options'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useNavigate } from 'react-router-dom'
// Define the libraries needed for Google Maps API. 'places' is essential.
const libraries = ['places']

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
}

const defaultMapOptions = {
  disableDefaultUI: true,
  zoomControl: true
}

const GooglePlacesAutocomplete = () => {
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const inputRef = useRef(null) // Ref for the input element
  const mapRef = useRef(null) // Ref to hold the Google Map instance
  const markerRef = useRef(null) // Ref to hold the Google Marker instance
  const autocompleteInstance = useRef(null) // Ref for the Google Autocomplete instance
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [inputValue, setInputValue] = useState('')

  //state for map props
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 })
  const [mapZoom, setMapZoom] = useState(4)

  const [formData, setFormData] = useState({
    location: null,
    days: '',
    budget: null,
    travelers: null,
    interests: []
  })

  const [isLoading, setIsLoading] = useState(false)

  const [travelPlan, setTravelPlan] = useState(null)
  const [error, setError] = useState(null)
  const mapsAPIKey = 'AIzaSyBKDIGrnIb2mrnKUeNX7QSZogX9JYVoiSA'
  // Callback for when the Google Maps API script finishes loading
  const onLoadScript = useCallback(mapsAPIKey => {
    if (window.google && window.google.maps) {
      setIsApiLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsAPIKey}&libraries=places`
    script.async = true
    script.defer = true
    script.id = 'google-maps-script' // Add an ID to easily check if it exists
    script.onload = () => {
      console.log('Google Maps API loaded successfully.')
      setIsApiLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps script.')
      setError('Failed to load Google Maps. Please refresh the page.')
    }
    document.head.appendChild(script)
  }, [])

  // Effect to initialize Google Places Autocomplete once API is loaded and inputRef is ready
  useEffect(() => {
    if (
      isApiLoaded &&
      inputRef.current &&
      window.google &&
      window.google.maps
    ) {
      const mapDiv = document.getElementById('google-map-display')

      if (mapDiv && !mapRef.current) {
        // Initialize map only if it hasn't been initialized
        mapRef.current = new window.google.maps.Map(mapDiv, {
          center: mapCenter,
          zoom: mapZoom,
          disableDefaultUI: true,
          zoomControl: true
        })
        console.log('Google Map initialized.')
      } else if (mapRef.current) {
        // If map already exists, just update its center/zoom in case state changed
        mapRef.current.setCenter(mapCenter)
        mapRef.current.setZoom(mapZoom)
      }

      //TRY
      if (place && place.geometry && place.geometry.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        if (markerRef.current) {
          markerRef.current.setPosition(newPosition)
          markerRef.current.setMap(mapRef.current) // Ensure marker is on the current map instance
          markerRef.current.setTitle(place.name)
        } else if (mapRef.current) {
          // Only create marker if map exists
          markerRef.current = new window.google.maps.Marker({
            position: newPosition,
            map: mapRef.current,
            title: place.name
          })
        }
      } else {
        // Remove marker if no place is selected
        if (markerRef.current) {
          markerRef.current.setMap(null) // Detach marker from map
          markerRef.current = null
        }
      }

      //TRY

      // Create a new Autocomplete instance and attach it to the input element
      autocompleteInstance.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['park'],
          componentRestrictions: { country: 'us' }
        }
      )

      // Add a listener for the 'place_changed' event
      autocompleteInstance.current.addListener('place_changed', () => {
        const selectedPlace = autocompleteInstance.current.getPlace()
        if (selectedPlace.geometry && selectedPlace.geometry.location) {
          setPlace(selectedPlace)

          setInputValue(
            selectedPlace.formatted_address || selectedPlace.name || ''
          )
          setMapCenter({
            lat: selectedPlace.geometry.location.lat(),
            lng: selectedPlace.geometry.location.lng()
          })
          setMapZoom(12)

          setFormData(prev => ({
            ...prev,
            location: {
              name: selectedPlace.name,
              address: selectedPlace.formatted_address,
              lat: selectedPlace.geometry.location.lat(),
              lng: selectedPlace.geometry.location.lng()
            }
          }))
        } else {
          setPlace(null)
          setInputValue('')
          setMapCenter({ lat: 39.8283, lng: -98.5795 })
          setMapZoom(4)
        }
        console.log('Selected Place:', selectedPlace)
      })
    }

    // Cleanup function for when the component unmounts
    return () => {
      // Detach listeners if needed, though GC typically handles it
      // if (autocompleteInstance.current) {
      //   // There's no direct 'destroy' method for Autocomplete.
      //   // The instance will be garbage collected when the input element is removed.
      // }
    }
  }, [isApiLoaded]) // Rerun effect when API loading status changes

  // Handle manual input changes
  const handleInputChange = e => {
    setInputValue(e.target.value)
    // You might want to clear the selected place if the user starts typing again
    if (place) {
      setPlace(null)
      setMapCenter({ lat: 39.8283, lng: -98.5795 })
      setMapZoom(4)
      setFormData(prev => ({ ...prev, location: null }))
    }
  }

  const handleDaysChange = e => {
    const rawValue = e.target.value
    let newDays

    if (rawValue === '') {
      newDays = ''
    } else {
      const parsedValue = parseInt(rawValue, 10)
      if (isNaN(parsedValue)) {
        newDays = ''
      } else {
        newDays = Math.min(Math.max(1, parsedValue), 10)
      }
    }

    setFormData(prev => ({
      ...prev,
      days: newDays
    }))
  }

  const handleBudgetSelect = budgetTitle => {
    setFormData(prev => ({ ...prev, budget: budgetTitle }))
  }
  const handleTravelersSelect = travelersTitle => {
    setFormData(prev => ({ ...prev, travelers: travelersTitle }))
  }

  const handleInterestsSelect = intTitle => {
    // setFormData(prev => {
    //   const currentInterests = prev.interests
    //   if (currentInterests.includes(intTitle)) {
    //     return {
    //       ...prev,
    //       interests: currentInterests.filter(item => item !== intTitle)
    //     }
    //   } else {
    //     return {
    //       ...prev,
    //       interests: [...currentInterests, intTitle]
    //     }
    //   }
    // })
    setFormData(prev => ({
      ...prev,
      interests: prev.interests === intTitle ? null : intTitle
    }))
  }

  const handleGenerateTrip = async () => {
    setError(null)
    // setTravelPlan(null)
    //Check if any field is missing, return if missing
    if (
      !formData?.location ||
      !formData?.budget ||
      !formData?.days ||
      !formData?.interests ||
      !formData?.travelers
    ) {
      alert('Please enter all the information')
      return
    }

    //Prompt for AI
    const prompt = `Generate a travel plan for Location: ${
      formData.location?.name || 'Unknown Park'
    }, for ${formData.days || 'a few'} days for ${
      formData.travelers || 'any'
    } travelers with ${formData.budget || 'any'} budget. ${
      formData.interests ? `I'm interested in ${formData.interests}.` : ''
    }

    Include ${
      formData.interests
    } options with campground or hotel names nearby, hiking options in the park, a park image url, geo coordinates, rating, descriptions.
    Suggest a detailed itinerary with placeName, place details, place image url, geo coordinates, ticket pricing, if a permit is required or not for the hike, rating, specific hiking options, camping options, hotel options, time of day for each location for each day.
    Also include general budget tips and important notes for the trip.

    The response MUST be in JSON format matching the schema provided.`

    const responseSchema = {
      type: 'OBJECT',
      properties: {
        location: { type: 'STRING' },
        tripDuration: { type: 'STRING' },
        travelers: { type: 'STRING' },
        imageURL: { type: 'STRING' },
        geoCoordinates: {
          type: 'OBJECT',
          properties: {
            latitude: { type: 'NUMBER' },
            longitude: { type: 'NUMBER' }
          },
          required: ['latitude', 'longitude']
        },

        rating: { type: 'NUMBER' },
        description: { type: 'STRING' },
        campingOptionsNearby: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              campgroundName: { type: 'STRING' },
              distanceFromPark: { type: 'STRING' },
              pricePerNight: { type: 'STRING' },
              description: { type: 'STRING' },
              reservations: { type: 'STRING' }
            },
            required: ['campgroundName', 'pricePerNight']
          }
        },
        hikingOptions: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              trailName: { type: 'STRING' },
              difficulty: { type: 'STRING' },
              description: { type: 'STRING' },
              distance: { type: 'STRING' },
              duration: { type: 'STRING' },
              ticketPricing: { type: 'STRING' },
              permit: { type: 'STRING' },
              imageURL: { type: 'STRING' }
            },
            required: ['trailName']
          }
        },
        itinerary: {
          type: 'ARRAY',
          items: {
            // For day1, day2, etc.
            type: 'OBJECT',
            properties: {
              dayNumber: { type: 'NUMBER' }, // Added day number for clarity in array
              theme: { type: 'STRING' },
              bestTimeToVisit: { type: 'STRING' },
              plan: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    placeName: { type: 'STRING' },
                    placeDetails: { type: 'STRING' },
                    placeImageURL: { type: 'STRING' },
                    geoCoordinates: {
                      type: 'OBJECT',
                      properties: {
                        latitude: { type: 'NUMBER' },
                        longitude: { type: 'NUMBER' }
                      }
                    },
                    ticketPricing: { type: 'STRING' },
                    rating: { type: 'NUMBER' },
                    hikingOptions: { type: 'ARRAY', items: { type: 'STRING' } },
                    campingOptions: {
                      type: 'ARRAY',
                      items: { type: 'STRING' }
                    },
                    hotelOptions: { type: 'STRING' },
                    time: { type: 'STRING' }
                  },
                  required: ['placeName', 'placeDetails']
                }
              }
            },
            required: ['dayNumber', 'theme', 'plan']
          }
        },
        budgetTips: { type: 'ARRAY', items: { type: 'STRING' } },
        importantNotes: { type: 'ARRAY', items: { type: 'STRING' } }
      },
      required: ['location', 'tripDuration', 'itinerary']
    }

    try {
      let chatHistory = []
      chatHistory.push({ role: 'user', parts: [{ text: prompt }] })
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        }
      }

      const apiKey = 'AIzaSyBttJ1eFlcLDssmN0k9ZAE5pNGhRIYF_y0' //Gemini api key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const json = result.candidates[0].content.parts[0].text
        const parsedJson = JSON.parse(json)
        navigate('/trip-details', { state: { travelPlan: parsedJson } })
        // setTravelPlan(parsedJson)
        console.log('Travel plan from AI: ', parsedJson)
      } else {
        setError('Failed to generate travel plan, api error')
        console.log('API response error: ', result)
      }
    } catch (err) {
      console.log('Error generating travel plan: ', err)
      setError('Error occurred while generating travel plan')
    }

    console.log('Generating Trip with data: ', formData)
  }
  return (
    <>
      <LoadScript
        googleMapsApiKey='AIzaSyBKDIGrnIb2mrnKUeNX7QSZogX9JYVoiSA' // <<< IMPORTANT: Replace with your actual API Key
        libraries={libraries}
        onLoad={onLoadScript} // Use this callback to confirm API is loaded
      >
        <InternalContent
          place={place}
          inputRef={inputRef}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          setPlace={setPlace}
          setInputValue={setInputValue}
          setMapCenter={setMapCenter}
          setMapZoom={setMapZoom}
          isApiLoaded={true}
          mapContainerStyle={mapContainerStyle}
          mapZoom={mapZoom}
          mapCenter={mapCenter}
          defaultMapOptions={defaultMapOptions}
        />
      </LoadScript>

      {/**other form data */}
      <h5 className='text-l my-3 font-medium'>How many days?</h5>
      <Input
        placeholder={'Example 3'}
        type='number'
        max='10'
        min='1'
        value={formData.days}
        onChange={handleDaysChange}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent'
      />
      <br />
      <h5 className='text-l my-3 font-medium'>What is your budget?</h5>
      <div className='grid grid-cols-3 gap-5 mt-3'>
        {SelectBudgetOptions.map((item, index) => (
          <div
            key={index}
            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-200 ${
              formData.budget === item.title
                ? 'bg-red-100 border-[#400406]  shadow-md'
                : 'bg-white border-gray-200'
            }`}
            onClick={() => handleBudgetSelect(item.title)}
          >
            <h2 className='text-4x'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2 className='text-sm text-gray-500'>{item.desc}</h2>
          </div>
        ))}
      </div>
      <br />
      <h5 className='text-l my-3 font-medium'>Group size?</h5>
      <div className=' grid grid-cols-3 gap-5 mt-3'>
        {SelectTravelersList.map((item, index) => (
          <div
            key={index}
            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-200 ${
              formData.travelers === item.title
                ? 'bg-red-100 border-[#400406]  shadow-md'
                : 'bg-white border-gray-200'
            }`}
            onClick={() => handleTravelersSelect(item.title)}
          >
            <h2 className='text-4x'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2 className='text-sm text-gray-500'>{item.desc}</h2>
          </div>
        ))}
      </div>

      <br />
      <h5 className='text-l my-3 font-medium'>Interests?</h5>
      <div className=' grid grid-cols-3 gap-5 mt-3'>
        {InterestsOptionsList.map((item, index) => (
          <div
            key={index}
            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg transition-all duration-200 ${
              formData.interests === item.title
                ? 'bg-red-100 border-[#400406] shadow-md'
                : 'bg-white border-gray-200'
            }`}
            onClick={() => handleInterestsSelect(item.title)}
          >
            <h2 className='text-4x'>{item.icon}</h2>
            <h2 className='font-bold text-lg'>{item.title}</h2>
            <h2 className='text-sm text-gray-500'>{item.desc}</h2>
          </div>
        ))}
      </div>

      <div className='my-10 justify-center'>
        <Button
          className='cursor-pointer px-8 py-3 bg-[#515a47] text-white rounded-lg shadow-md hover:bg-[#400406] transition-colors duration-200 flex items-center gap-2'
          disabled={isLoading}
          onClick={handleGenerateTrip}
        >
          {isLoading ? 'Generating....🏕️' : 'Generate Trip..🛩️'}
        </Button>
      </div>
      {error && (
        <div className='mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          Error: {error}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
          <div className='flex flex-col items-center text-white'>
            <svg
              className='animate-spin h-10 w-10 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            <p className='mt-4 text-lg'>Generating your trip plan...</p>
          </div>
        </div>
      )}
    </>
  )
}

const InternalContent = ({
  place,
  inputRef,
  inputValue,
  handleInputChange,
  setPlace,
  setInputValue,
  setMapCenter,
  setMapZoom,
  isApiLoaded,
  mapContainerStyle,
  mapCenter,
  mapZoom,
  defaultMapOptions
}) => {
  const [mapLoaded, setMapLoaded] = useState(false)

  const onMapLoad = useCallback(() => {
    setMapLoaded(true)
  }, [])

  const onMapUnmount = useCallback(() => {
    setMapLoaded(false)
  }, [])

  const handleClearForm = () => {
    setPlace(null)
    setInputValue('') // Clear input too
    setMapCenter({ lat: 39.8283, lng: -98.5795 })
    setMapZoom(4)
    setFormData({
      location: null,
      days: '',
      budget: null,
      travelers: null,
      interests: null
    })
    setError(null)
    setIsLoading(false)

    if (markerRef) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }

    if (mapRef.current) {
      mapRef.current.setCenter({ lat: 39.8283, lng: -98.5795 })
      mapRef.current.setZoom(4)
      // To ensure a full re-initialization on return, you might also want to nullify mapRef.current
      // This forces the `if (mapDiv && !mapRef.current)` condition in useEffect to be true again
      mapRef.current = null
      console.log('Map reference cleared for re-initialization.')
    }
    // Also re-trigger Google Maps script loading state if necessary
    setIsApiLoaded(false)
    // Remove the script element from the DOM to force a fresh load
    const existingScript = document.getElementById('google-maps-script')
    if (existingScript) {
      existingScript.remove()
      console.log('Google Maps script removed from DOM.')
    }
  }

  return (
    <div className=' bg-gray-100 flex items-center justify-center p-3 font-sans'>
      <div className='bg-white p-3 rounded-lg shadow-xl max-w-lg w-full'>
        <div className='mb-4'>
          <label
            htmlFor='address-input'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            US National Park Search:
          </label>
          <input
            id='address-input'
            type='text'
            ref={inputRef} // Attach the ref to the input element
            placeholder='Enter National Park..'
            value={inputValue}
            onChange={handleInputChange} // Controlled input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        {place && (
          <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md'>
            <h4 className='text-lg font-semibold text-[#515a47] mb-2'>
              Selected National Park:
            </h4>
            <p className='text-amber-700'>
              <strong className='font-medium'>Name:</strong> {place.name}
            </p>
            <p className='text-[#755c1b]'>
              <strong className='font-medium'>Address:</strong>{' '}
              {place.formatted_address}
            </p>
            {/* {place.geometry && (
              <p className='text-blue-700'>
                <strong className='font-medium'>Latitude:</strong>{' '}
                {place.geometry.location.lat()}
                <br />
                <strong className='font-medium'>Longitude:</strong>{' '}
                {place.geometry.location.lng()}
              </p>
            )}  setTravelPlan(null)*/}
            <button
              onClick={handleClearForm}
              className='mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Clear Selection
            </button>
          </div>
        )}

        {/*Google Map display */}
        <div className='relative overflow-hidden rounded-lg shadow-md border border-gray-200'>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={mapZoom}
            options={defaultMapOptions}
            onLoad={onMapLoad}
            onUnmount={onMapUnmount}
          >
            {mapLoaded && place && place.geometry && place.geometry.location && (
              <Marker
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }}
                title={place.name}
              />
            )}
          </GoogleMap>
          {!mapLoaded && (
            <div
              className='absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 p-4'
              style={mapContainerStyle}
            >
              Loading Map...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GooglePlacesAutocomplete

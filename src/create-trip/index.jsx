import { Input } from '@/components/ui/input'
import GooglePlacesAutocomplete from '../components/custom/GooglePlacesAutocomplete'
import React from 'react'
import {
  InterestsOptionsList,
  SelectBudgetOptions,
  SelectTravelersList
} from '../constants/options'
import { Button } from '@/components/ui/button'

function CreateTrip () {
  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-2xl'>
        Which National Park would you like to visit?
      </h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information and the trip planner will generate a
        customized itinerary based on your preferences 🫎
      </p>

      <div className='mt-10'>
        <div>
          <h5 className='text-l my-3 font-medium'>Destination of choice?</h5>
          <GooglePlacesAutocomplete />

          {/* <h5 className='text-l my-3 font-medium'>How many days?</h5>
          <Input placeholder={'Example 3'} type='number' />
          <br />
          <h5 className='text-l my-3 font-medium'>What is your budget?</h5>
          <div className='grid grid-cols-3 gap-5 mt-3'>
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className='p-4 border cursor-pointer rounded-lg hover:shadow-lg'
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
                className='p-4 border cursor-pointer rounded-lg hover:shadow-lg'
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
                className='p-4 border cursor-pointer rounded-lg hover:shadow-lg'
              >
                <h2 className='text-4x'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='my-10 justify-center'>
        <Button>Generate Trip..🛩️</Button>
      </div> */}
      </div>
      </div>
    </div>
  )
}

export default CreateTrip

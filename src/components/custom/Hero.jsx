import React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero () {
 
    const items = [
    {
      id: 1,
      name: 'Support Park Staff',
      type: 'Advocate for increased funding for national parks and oppose budget cuts that could negatively impact staffing and maintenance.'
    },
    {
      id: 2,
      name: 'Respect Wildlife',
      type: 'Observe animals from a distance, avoid feeding them, and never approach them.'
    },
    {
      id: 3,
      name: 'Leave No Trace',
      type: 'Pack out everything you pack in, dispose of waste properly, and avoid disturbing the environment.'
    },
    {
      id: 4,
      name: 'Visit Often & Stay on Trails',
      type: 'This boosts the funding, prevents damage to vegetation, fragile ecosystems, and at-risk species. '
    },
    {
      id: 5,
      name: 'Raise Awareness & Promote Park Education',
      type: 'Provide opportunities for visitors to learn about the resources and the importance of conservation.'
    },
    {
      id: 6,
      name: 'Advocate for Climate Action',
      type: 'support initiatives that address climate change.'
    }
  ]
  return (
    
    <div className=' items-center mx-2 gap-9 mt-2'>
      <h1 className='font-semibold text-[18px]'>
        Did you know?
        <br />
        <span className='font-extrabold text-[#515A47]'>
          National parks in the US are facing a multitude of problems, including
          budget cuts, staffing shortages, and the effects of climate change,
          leading to concerns about their preservation and visitor experience!
        </span>
      </h1>
      <br />
      <div>
        <h2 className='font-semibold text-[15px] text-black-500 text-center'>
          Here's how to protect them: (click on each item to expand)
        </h2>
        <div className='flex cursor-pointer'>
          <div className='bg-white p-2 rounded-sm cursor-pointer'>
            <ul className='space-y-4'>
              {items.map(item => (
                <div className=' border border-black-20 rounded-md p-4 flex justify-between items-center cursor-pointer'>
                  <Collapsible>
                    <CollapsibleTrigger>
                      <p className='text-sm font-semibold text-shadow-amber-400 !important'>
                        {item.id}. {item.name}
                      </p>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className='text-sm'>{item.type}</p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <br />
      <h1 className='font-semibold text-[18px]'>
        Discover Your Next &nbsp;
        <span className='font-extrabold text-[#515A47]'>
          National Park Adventure
        </span>
        : Get a Personalized Itinerary with the help of AI!
      </h1>

      <br />
      <div className='flex flex-col items-center'>
        <Link to={'/create-trip'}>
          <Button className={'bg-amber-900'}>Get Started, It's Free</Button>
        </Link>
      </div>
      <br />
     
    </div>
  )
}

export default Hero

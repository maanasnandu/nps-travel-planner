import React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { ChevronDownIcon } from '@radix-ui/react-icons' // Import an icon for the collapsible trigger

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
      type: 'Support initiatives that address climate change.'
    }
  ]

  return (
    <div className='container mx-auto px-4 py-8 md:py-12'>
      {/* Section 1: Did You Know? */}
      <section className='mb-10 text-center'>
        <h3 className='text-3xl md:text-4xl font-bold mb-4 leading-tight'>
          Did you know?
          <br />
          <span className='text-[#515A47] font-extrabold'>
            Our National Parks face significant challenges like budget cuts,
            staffing shortages, and climate change impacts, threatening their
            preservation and the visitor experience.
          </span>
        </h3>
      </section>

      {/* Section 2: How to Protect Them */}
      <section className='mb-10'>
        <h2 className='text-xl md:text-2xl font-semibold text-center mb-6'>
          Here's how to protect them: (click on each item to expand)
        </h2>
        <div className='max-w-3xl mx-auto'>
          <ul className='space-y-4'>
            {items.map(item => (
              <li
                key={item.id}
                className='bg-white border border-gray-200 rounded-lg shadow-sm'
              >
                <Collapsible className='p-4'>
                  <CollapsibleTrigger className='flex justify-between items-center w-full text-left'>
                    <p className='text-base md:text-lg font-semibold text-gray-800'>
                      {item.id}. {item.name}
                    </p>
                    <ChevronDownIcon className='h-5 w-5 text-gray-600 transition-transform data-[state=open]:rotate-180' />
                  </CollapsibleTrigger>
                  <CollapsibleContent className='pt-2 text-gray-600 text-sm md:text-base'>
                    <p>{item.type}</p>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 3: Discover Your Next Adventure */}
      <section className='text-center mb-10'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6 leading-tight'>
          Discover your next &nbsp;
          <span className='font-extrabold text-[#515A47]'>
            National Park adventure
          </span>
          : Get a personalized itinerary with the help of AI!
        </h1>
        <Link to={'/create-trip'}>
          <Button className='bg-amber-900 hover:bg-amber-800 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105'>
            Get Started, It's Free
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default Hero

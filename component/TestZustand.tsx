"use client"

import React from 'react'
import { usePersonStore } from '@/store/usePersonStore'
import { combineBoth } from '@/store/usePersonStore'

const TestZustand = () => {
const firstname = usePersonStore((state) => state.firstName)

  return (
    <div>
         <input
          // Update the "firstName" state
          onChange={(e) => combineBoth(e.currentTarget.value)}
          value={firstname}
        />
        
        {firstname}</div>
  )
}

export default TestZustand
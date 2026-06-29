import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Banner from './components/Banner';
import Hero from './components/Hero';

const App = () => {

  const [searchQuery,setSearchQuery] = useState('best sellers');
  return (
    <>
      <div className='bg-gray-900 min-h-screen'>
        <Navbar handleSearch={(term) => setSearchQuery(term)} />
        <Banner/>
        <Hero searchQuery={searchQuery}/>
      </div>
    </>
  )
}

export default App
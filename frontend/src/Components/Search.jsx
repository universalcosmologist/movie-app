import React from 'react'

function Search({searchTerm,setSearchTerm}) {
  return (
    <div className='search'>
       <div>
         <img src='search.png' alt='search-box'/>
        <input
            type='text'
            placeholder='search through thousand of movies'
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
        />
       </div>
    </div>
  )
}

export default Search
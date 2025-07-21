import React,{useState,useEffect, use} from "react"
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";
import Search from "./Components/Search";
import {useDebounce} from 'react-use'
import {getTrendingMovies,updateCount} from './appwrite'

function App() {
  const [movieList,setMovieList]=useState([]);
  const [trendingMovies,setTrendingMovies]=useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const [debounceSearchTerm,setDebounceSearchTerm]=useState("");
  const [errorMessage,setErrorMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const TDMB_READ_KEY=import.meta.env.VITE_TMDB_API_READ_ACCESS_KEY;
  const Base_Url="https://api.themoviedb.org/3";
  const options = {
  method: 'GET',
  headers: {
     accept: 'application/json',
     Authorization: `Bearer ${TDMB_READ_KEY}`
    }
  };


  const fetch_movies=async(query="")=>{
    setLoading(true);
    try {
      const end_point=query ? `${Base_Url}/search/movie?query=${encodeURIComponent(query)}` : `${Base_Url}/discover/movie?sort_by=popularity.desc`
      const result=await fetch(end_point,options);

      if(!result.ok){
        throw new Error('Failed to fetch movies');
      }

      const data=await result.json();
      console.log(data);

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      if(query && data.results.length>0){
        updateCount(data.results[0]);
      }

      setMovieList(data.results || []);

    } catch (error) {
      console.log("error in fetching movies",error);
      setErrorMessage("error occured in fetching movies");
    }
    setLoading(false);
  }

  const getTrendingList=async()=>{
   try {
    const result=await getTrendingMovies();
    setTrendingMovies(result);
   } catch (error) {
    console.log("error occured in getting trending movies",error);
   }
  }

  useEffect(()=>{
    fetch_movies(debounceSearchTerm);
  },[debounceSearchTerm]);

  useEffect(()=>{
    getTrendingList();
  },[]);

  useDebounce(
    ()=>{
      setDebounceSearchTerm(searchTerm);
    },
    700,
    [searchTerm]
  );

  return (
   <main>
    <div className="pattern"/>
    <div className="wrapper">
     <header>
         <img src="./hero-img.png" alt="hero-image"/>
         <h1>Find <span className="text-gradient">Movies</span> That You Enjoy Hassle Free</h1>

         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
     </header>
     {trendingMovies &&  trendingMovies.length > 0 && (
      <section className="trending">
        <h2>Trending Movies</h2>
          <ul>
          {trendingMovies.map((movie, index) => (
            <li key={movie.$id}>
            <p>{index + 1}</p>
            <img src={movie.poster_url} alt={movie.title} />
            </li>
            ))}
          </ul>
      </section>
      )}
     <section className="all-movies">
          <h2>All Movies</h2>

          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
     </section> 
    </div> 
   </main>
  )
}

export default App

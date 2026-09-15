# Session 09 — Practice: Capstone Idea

## What We're Learning Today

Today you apply everything from Weeks 1-3 to build the foundation of your capstone project. You'll choose a topic, set up routing-free data fetching, and practice useEffect + custom hooks in a real project.

## Prerequisites

- Sessions 01-08 completed
- A clear idea of what you want to build (or pick from the approved APIs below)

## Concepts

### 1. Choosing Your Capstone Topic

Pick a domain that interests you — you'll be building this for 6 more weeks. Good capstone projects have:
- At least 3-5 views/screens
- Data from an external API
- Room for features (search, filter, details, etc.)

**Approved APIs (free, CORS-friendly, no API key needed):**

| Domain | API | URL |
|--------|-----|-----|
| Movies | TMDB | themoviedb.org/documentation/api |
| Weather | Open-Meteo | open-meteo.com |
| Countries | REST Countries | restcountries.com |
| Space | NASA APOD | api.nasa.gov |
| Food | TheMealDB | themealdb.com |
| Games | RAWG | rawg.io/apidocs |
| Books | Open Library | openlibrary.org/developers/api |
| Pokemon | PokeAPI | pokeapi.co |

### 2. Plan Your Component Tree

Before coding, sketch your components:

```
App
├── Header (navigation)
├── Home (featured items, search)
├── List (filtered grid of items)
├── Detail (single item view)
└── Footer
```

### 3. Data Flow for Your Capstone

```
API → useEffect → State → Props → Components → UI
```

This is the pattern you've learned. Every component receives data through props, and state lives as high as it needs to.

### 4. Building the Foundation Today

Today's goal is NOT to build the whole app. Focus on:
1. Fetching data from your chosen API
2. Displaying a list of items
3. Showing details for one item
4. Getting the data flow working end-to-end

### 5. The Three Building Blocks You Already Know

Everything in your capstone (so far) uses just these three patterns:

**Pattern 1: Fetch and display**
```jsx
const [items, setItems] = useState([]);
useEffect(() => { /* fetch */ }, []);
return items.map(item => <Card key={item.id} item={item} />);
```

**Pattern 2: Pass data down**
```jsx
<App> → items as props → <List> → <Card item={item} />
```

**Pattern 3: Respond to user action**
```jsx
function handleSelect(item) { setSelectedItem(item); }
```

### 6. File Structure

Start organized from the beginning:

```
my-capstone/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Card.jsx
│   │   └── Card.module.css
│   ├── hooks/
│   │   └── useFetch.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

## Step-by-Step Walkthrough

1. Create your capstone project:
   ```bash
   npm create vite@latest my-capstone -- --template react
   cd my-capstone
   npm install
   ```

2. Create the folder structure:
   ```bash
   mkdir src/components src/hooks
   ```

3. Create `src/hooks/useFetch.js` (copy from Session 08):
   ```jsx
   import { useState, useEffect } from 'react';

   export default function useFetch(url) {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       async function fetchData() {
         try {
           const response = await fetch(url);
           if (!response.ok) throw new Error('Failed to fetch');
           const json = await response.json();
           setData(json);
         } catch (err) {
           setError(err.message);
         } finally {
           setLoading(false);
         }
       }
       fetchData();
     }, [url]);

     return { data, loading, error };
   }
   ```

4. Create your first component (example for a movies app):
   ```jsx
   // src/components/MovieCard.jsx
   import styles from './MovieCard.module.css';

   function MovieCard({ movie, onSelect }) {
     return (
       <div className={styles.card} onClick={() => onSelect(movie)}>
         <img
           src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
           alt={movie.title}
         />
         <h3>{movie.title}</h3>
         <p>{movie.release_date}</p>
       </div>
     );
   }

   export default MovieCard;
   ```

5. Build the main App:
   ```jsx
   import { useState } from 'react';
   import useFetch from './hooks/useFetch';
   import MovieCard from './components/MovieCard';

   function App() {
     const { data: movies, loading, error } = useFetch(
       'https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY'
     );
     const [selectedMovie, setSelectedMovie] = useState(null);

     if (loading) return <p>Loading...</p>;
     if (error) return <p>Error: {error}</p>;

     return (
       <div>
         <h1>My Movie App</h1>
         {selectedMovie ? (
           <div>
             <button onClick={() => setSelectedMovie(null)}>← Back</button>
             <h2>{selectedMovie.title}</h2>
             <p>{selectedMovie.overview}</p>
           </div>
         ) : (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
             {movies?.map(movie => (
               <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
             ))}
           </div>
         )}
       </div>
     );
   }

   export default App;
   ```

6. Run `npm run dev` and verify it works.

## Try It Yourself

1. **Easy:** Pick your API and fetch data. Display the first 10 items in a list.

2. **Medium:** Create a detail view. When you click an item, show more information about it.

3. **Challenge:** Add a search input that filters the list by name (no routing needed yet — just use state).

## Common Mistakes & How to Fix Them

- **"CORS error"** — You're using an API that blocks browser requests. Stick to the approved list above
- **API needs a key** — Some APIs require a free signup for a key. TMDB and RAWG need one — sign up and follow their docs
- **App looks ugly** — That's fine! We'll cover styling in Week 6. Focus on functionality today
- **Trying to do too much** — Remember: today is just data fetching + list + detail. Routing comes next week

## Recap / Checklist

After today, you should be able to:

- [ ] Choose and set up a capstone project
- [ ] Fetch data from a public API
- [ ] Display a list of items with `.map()`
- [ ] Show details for a selected item using state
- [ ] Have a clean folder structure ready for expansion

## Useful Links

- [TMDB API Documentation](https://www.themoviedb.org/documentation/api)
- [Open-Meteo API](https://open-meteo.com/en/docs)
- [PokeAPI Documentation](https://pokeapi.co/docs/v2)
- [React Project Structure](https://react.dev/learn/start-a-new-react-project)

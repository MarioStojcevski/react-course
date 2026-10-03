// page opens
// ↓
// React renders component
// ↓
// useEffect runs
// ↓
// fetch data from API
// ↓
// setState saves data
// ↓
// React renders again with the data

// App.jsx
// │
// ├── DocumentTitle.jsx
// │    └── useState + useEffect
// │
// └── UserList.jsx
//     └── fetch API with useEffec

//  fetch  -  loading  - error - data

import UserList from './UserList';
import DocumentTitle from './DocumentTitle';

  {/* try Easy  */}
import PostList from './PostList';
    //  try medium 
import UserPosts from './UserPosts';
    // try hard
import SearchPosts from './SearchPosts'; 

function App() {
  return (
    <div>
      <h1>Data Fetching</h1>

      <DocumentTitle />
      <UserList />

      {/* try Easy  */}
      <PostList />

      {/* try medium  */}
      <UserPosts />

       {/* try hard  */}
       <SearchPosts />

    </div>
  );
}

export default App;


// query changes
// ↓
// useEffect runs
// ↓
// setTimeout waits 300ms
// ↓
// if user types again → clearTimeout
// ↓
// when user stops typing → fetch


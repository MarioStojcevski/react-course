import SignupForm from './SignupForm';

//  try easy 
import CounterDemo from './CounterDemo';

// medium 
import Posts from './Posts';

//  try hard 
import MultiStepForm from './MultiStepForm';

function App() {
  return (
    <div>
      <h1>Forms & Custom Hooks</h1>

      <SignupForm />

       {/* try easy  */}
       <CounterDemo />

         {/* try medium  */}
         <Posts />

         {/* Try hard  */}
         <MultiStepForm />
    </div>
  );
}

export default App;

// Posts component
// ↓
// useFetch(URL)
// ↓
// useEffect runs
// ↓
// fetch()
// ↓
// data arrives
// ↓
// setData(json)
// ↓
// Posts re-renders
// ↓
// first 5 post titles appear
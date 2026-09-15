import useOnlineStatus from '../hooks/onlineStatus';

function Comp1() {
  const { isOnline, setIsOnline, counter, setCounter } = useOnlineStatus();

  return (
    <>
      <button onClick={() => setIsOnline((prevState) => !prevState)}>{isOnline ? 'Go offline' : 'Go online'}</button>
      <h1>{isOnline ? '✅ Online' : '❌ Offline'}</h1>

      <br />

      <button onClick={() => setCounter((prevState) => prevState + 1)}>Increment</button>
      {counter}
    </>
  )
}

export default Comp1;
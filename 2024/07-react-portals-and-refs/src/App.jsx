import Player from './components/Player.jsx';
import TimerChallenge from './components/TimerChallenge.jsx';

function App() {
  return (
    <>
      <Player />
      <div id="challenges">
        <TimerChallenge title={"One second"} targetTime={1} />
        <TimerChallenge title={"Five seconds"} targetTime={5}/>
        <TimerChallenge title={"Ten seconds"} targetTime={10}/>
        <TimerChallenge title={"Thirty seconds"} targetTime={30}/>
      </div>
    </>
  );
}

export default App;

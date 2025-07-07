import {TimerWithMedian} from './components/TimerWithMedian';
import Logs from './components/Logs';
import MonthMedian from './components/MonthMedian';
import './App.css';

function App() {
  return (
    <div>
      <TimerWithMedian />
      <Logs />
      <MonthMedian />
    </div>
  );
}

export default App;

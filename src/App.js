import {TimerWithMedian} from './components/TimerWithMedian';
import Logs from './components/Logs';
import MonthMedian from './components/MonthMedian';
import './App.css';

function App() {
  return (
    <div className='h-[90%] flex justify-between items-center '>
      <Logs />
      <TimerWithMedian />
      <MonthMedian />
    </div>
  );
}

export default App;

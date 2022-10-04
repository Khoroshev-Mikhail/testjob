import { useEffect } from 'react';
import './App.scss';
import { useAppDispatch } from './app/hooks';
import { getAsyncData } from './Components/RoundSlider/roundSlice';
import RoundSlider from './Components/RoundSlider/RoundSLider';
import Slider from './Components/Slider/Slider';

function App() {
  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(getAsyncData())
  }, [])
  return (
    <div className="App">
      <RoundSlider />
      <Slider />
    </div>
  );
}

export default App;

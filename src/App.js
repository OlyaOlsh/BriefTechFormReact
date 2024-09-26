import { Route, Routes} from 'react-router-dom';

import BriefForm from './page/BriefForm/BriefForm';
import Home from './page/Home/Home';
import './App.css';
import {useEffect} from "react";



function App() {


  return (
    <div className="App">
          <div>привет</div> 
          <Routes>
          <Route path ="/home" element = {<Home/>}/>
          <Route path ="/briefform" element = {<BriefForm/>}/>
          </Routes>
    </div>
  );
}

export default App;

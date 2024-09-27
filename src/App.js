import { Route, Routes} from 'react-router-dom';

import BriefForm from './page/BriefForm/BriefForm';
import Home from './page/Home/Home';
import './App.css';
import IdeaList from './page/IdeaList/IdeaList';

function App() {
  return (
    <div className="App">
          <Routes>
          <Route path ="/" element = {<Home/>}/>
          <Route path ="/briefform" element = {<BriefForm/>}/>
          <Route path ="/ideaList" element = {<IdeaList/>}/>
          </Routes>
    </div>
  );
}

export default App;

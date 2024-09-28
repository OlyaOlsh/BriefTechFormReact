import { Route, Routes} from 'react-router-dom';

import BriefForm from './page/BriefForm/BriefForm';
import './App.css';
import IdeaList from './page/IdeaList/IdeaList';
import HomeBrief from './page/HomeBrief/HomeBrief';

function App() {
  return (
    <div className="App">
          <Routes>
          <Route path ="/" element = {<HomeBrief/>}/>
          <Route path ="/briefform" element = {<BriefForm/>}/>
          <Route path ="/ideaList" element = {<IdeaList/>}/>
          </Routes>
    </div>
  );
}

export default App;

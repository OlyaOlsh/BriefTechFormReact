import { Route, Routes} from 'react-router-dom';

import BriefForm from './page/BriefForm/BriefForm';
import './App.css';
import IdeaList from './page/IdeaList/IdeaList';
import HomeBrief from './page/HomeBrief/HomeBrief';
import BriefFormNew from './page/BriefFormNew/BriefFormNew';
import TestIdea from './page/TestIdea/TestIdea';

function App() {
  return (
    <div className="App">
          <Routes>
          <Route path ="/homenew" element = {<HomeBrief/>}/>
        {/* <Route path ="/briefform" element = {<BriefForm/>}/>*/}
        {/*  <Route path ="/ideaList" element = {<TestIdea/>}/>*/}
          <Route path ="/briefformnews" element = {<BriefFormNew/>}/>
          <Route path ="/testIdeanew" element = {<TestIdea/>}/>
          </Routes>
    </div>
  );
}

export default App;

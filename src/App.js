import './App.css';
import Nav from './main-component/nav/nav.component';
import BasicTabs from './main-component/tracking/tracking.component';
import { Routes, Route, Navigate} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Nav/>
      <div>
          <Routes>
            <Route exact path="/" element={<div>Home</div>}/>
            <Route exact path="/tracking" element={<BasicTabs/>}/>
          </Routes>
      </div>
    </div>
  );
}

export default App;

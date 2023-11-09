import './App.css';
import Menu from './components/Menu';

import MovieRegister from './components/MovieRegister';
import Home from './components/Home';
import MemberList from './components/MemberList';
import { NavLink, Routes, Route } from 'react-router-dom';
import Movie from './components/Movie';

function App() {
 

  return (
    <div className="container-fluid my-5 py-5">
      {/* 상단 메뉴 영역 */}
      <Menu />

      {/* 본문 영역 */}
      <div className="row">
        <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/movieRegister" element={<MovieRegister />}></Route>
            <Route path="/movie" element={<Movie />}></Route>
            <Route path="/memberList" element={<MemberList />}></Route>
          </Routes>
        </div>
      </div>
   
        
        
      </div>
  );
}

export default App;

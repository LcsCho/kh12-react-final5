import './App.css';
import Menu from './components/Menu';

import MovieRegister from './components/MovieRegister';
import Home from './components/Home';
import MemberList from './components/MemberList';
import { NavLink, Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';
import ReviewList from './components/ReviewList';

function App() {
 

  return (
    <div className="container-fluid my-5 py-5">
      {/* 상단 메뉴 영역 */}
      <Menu />

      {/* 본문 영역 */}
      <div className="row">
        <div className="col-md-10 offset-md-1 col-sm-10 offset-sm-1">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/movieRegister" element={<MovieRegister />}></Route>
            <Route path="/movieList" element={<MovieList />}></Route>
            <Route path="/memberList" element={<MemberList />}></Route>
            <Route path="/movieDetail" element={<MovieDetail />}></Route>
            <Route path="/reviewList" element={<ReviewList />}></Route>
          </Routes>
        </div>
      </div>
   
        
        
      </div>
  );
}

export default App;

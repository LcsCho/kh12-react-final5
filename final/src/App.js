import logo from './logo.svg';
import './App.css';
import Menu from './components/Menu';

function App() {
  return (
    <div className="container-fluid my-5 py-5">
      {/* 상단 메뉴 영역 */}
      <Menu />


      {/* 본문 영역 */}
      <div className="row">
        <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">

        </div>
      </div>

    </div>
  );
}

export default App;

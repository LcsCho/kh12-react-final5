import logo from './logo.svg';
import './App.css';
import Menu from './components/Menu';
import { AiOutlinePlus } from "react-icons/ai";

function App() {
  const iconStyle = {
    color: 'black',
    opacity: '100%',
  };

  const buttonStyle = {
    backgroundColor: '#B33939',
    opacity: '30%',
  };

  const spanStyle = {
    color: 'black',
    opacity: '100%', // span 요소의 opacity를 100%로 설정
  };

  return (
    <div className="container-fluid my-5 py-5">
      {/* 상단 메뉴 영역 */}
      <Menu />

      {/* 본문 영역 */}
      <div className="row">
        <div className="col-md-8 offset-md-2 col-sm-10 offset-sm-1">
          <div style={{ border: '2px solid #B33939', borderRadius: '5px' }} className="p-4">
            <h1>관리자</h1>
            <hr />
            <div className="row">
              <div className="col-md-4">
                <button className="btn btn-block" style={buttonStyle}>
                  <AiOutlinePlus style={iconStyle} /> <span className="text-black" style={spanStyle}>영화 등록</span>
                </button>
              </div>
              <div className="col-md-4">
                <button className="btn btn-block" style={buttonStyle}>
                  영화 목록
                </button>
              </div>
              <div className="col-md-4">
                <button className="btn btn-block" style={buttonStyle}>
                  회원 목록
                </button>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col-md-4">
                <p>회원 수</p>
              </div>
              <div className="col-md-4">
                <p>영화 개수</p>
              </div>
              <div className="col-md-4">
                <p>평점 수</p>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";

const Home = (props) => {
  
  const location = useLocation();
  const iconStyle = {
    color: "#B33939",
    opacity: "100%",
  };
  const navLinkStyle = {
    backgroundColor: "#B33939",
    opacity: "30%",
  };
  const spanStyle = {
    color: "black",
    opacity: "100%",
  };

  const IconNavLink = ({ icon, to, label }) => {
    return (
      <NavLink
        style={navLinkStyle}
        className={`nav-link ${location.pathname === to ? "active" : ""}`}
        to={to}
        display="inline-block"
      >
        {icon}
        <span style={spanStyle}>{label}</span>
      </NavLink>
    );
  };

  return (
    <div style={{ marginTop: '100px', marginBottom: '100px' }}>
        <div className="col-md-10 offset-md-1 col-sm-10 offset-sm-1 mt-5">
            <div style={{ border: '2px solid #B33939', borderRadius: '5px', marginTop: '20px', marginBottom: '20px', width: "100%", height: "400px" }} className="p-4">
                <h1>관리자</h1>
                <hr />
                <div className="row">
                    <div className="col-md-4">
                        <IconNavLink icon={<AiOutlinePlus style={iconStyle} />} to="/movieRegister" label="영화 등록" />
                    </div>
                    <div className="col-md-4">
                        <IconNavLink icon={<AiOutlineUnorderedList style={iconStyle} />} to="/movie" label="영화 목록" />
                    </div>
                    <div className="col-md-4">
                        <IconNavLink icon={<AiOutlineUnorderedList style={iconStyle} />} to="/memberList" label="회원 목록" />
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
);
};

export default Home;

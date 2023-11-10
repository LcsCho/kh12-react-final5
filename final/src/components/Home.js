import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import { Modal } from "bootstrap";

const Home = (props) => {

  const [memberCount, setMemberCount] = useState([]);
  const [ratingCount, setRatingCount] = useState([]);
  const [movieCount, setMovieCount] = useState([]);

  const loadMemberCount = async () => {
    const response = await axios({
      url: `${process.env.REACT_APP_REST_API_URL}/member/memberCount`,
      method: "get"
    });
    setMemberCount(response.data);
  };

  const loadRatingCount = async () => {
    const response = await axios({
      url: `${process.env.REACT_APP_REST_API_URL}/rating/ratingCount`,
      method: "get"
    });
    setRatingCount(response.data);
  };

  const loadMovieCount = async () => {
    const response = await axios({
      url: `${process.env.REACT_APP_REST_API_URL}/movie/movieCount`,
      method: "get"
    });
    setMovieCount(response.data);
  };

  useEffect(() => {
    loadMemberCount();
    loadRatingCount();
    loadMovieCount();
  }, []);


  const location = useLocation();
  const iconStyle = {
    color: "#B33939",
    opacity: "100%",
  };
  const navLinkStyle = {
    border: '2px solid #B33939',
    opacity: "100%"
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
          <div className="row text-center">
            <div className="col-md-4">
              <IconNavLink icon={<AiOutlineUnorderedList style={iconStyle} />} to="/actorList" label="배우 목록" />
            </div>
            <div className="col-md-4">
              <IconNavLink icon={<AiOutlineUnorderedList style={iconStyle} />} to="/movieList" label="영화 목록" />
            </div>
            <div className="col-md-4">
              <IconNavLink icon={<AiOutlineUnorderedList style={iconStyle} />} to="/memberList" label="회원 목록" />
            </div>
          </div>
          <hr />
          <div className="row text-center">
            <div className="col-md-4">
              <p >[회원 수]</p>
              <span>{memberCount}</span>
            </div>
            <div className="col-md-4">
              <p>[영화 개수]</p>
              <span>{movieCount}</span>
            </div>
            <div className="col-md-4">
              <p>[평점 수]</p>
              <span>{ratingCount}</span>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Home;

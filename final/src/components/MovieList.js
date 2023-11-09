import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LiaEdit } from "react-icons/lia";
import { AiFillDelete } from "react-icons/ai";

const MovieList = (props) => {
    const location = useLocation();
    const [movieList, setMovieList] = useState([]);

    const loadMovie = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/movie/adminMovieList`,
            method: "get"
        });
        setMovieList(response.data);
    };

    useEffect(() => {
        loadMovie();
    }, []);

    return (
        <>
            <h2>영화 목록</h2>

            <div className="row mt-4" >
                <div className="col text-center" style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="5%">번호</th>
                                <th width="30%">제목</th>
                                <th width="15%">감독</th>
                                <th width="15%">장르</th>
                                <th width="5%">국가</th>
                                <th width="20%">출연진</th>
                                <th width="10%">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movieList.map((movie, index) => (
                                <tr>
                                    <td>{movie.movieNo}</td>
                                    <td>{movie.movieName}</td>
                                    <td>{movie.movieDirector}</td>
                                    <td>{movie.genreName}</td>
                                    <td>{movie.movieNation}</td>
                                    <td>{movie.actorName}</td>
                                    <td>
                                       <div className="d-flex container-fluid">
                                            <div className="me-3">
                                                <NavLink className={`nav-link ${location.pathname === '/movieDetail' ? 'active' : ''}`}
                                                    to="/movieDetail">상세</NavLink>
                                            </div>
                                            <div className="">
                                                <NavLink className={`nav-link ${location.pathname === '/reviewList' ? 'active' : ''}`}
                                                    to="/reviewList">리뷰</NavLink>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default MovieList;
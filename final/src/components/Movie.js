import axios from "axios";
import { useState, useRef, useEffect } from "react";
import {LiaEdit} from "react-icons/lia";
import { AiFillDelete } from "react-icons/ai";

const Movie = (props) => {

    const [movieList, setMovieList] = useState([]);

    const loadMovie = async () => {
        const response = await axios({
            url:`${process.env.REACT_APP_REST_API_URL}/movie/adminMovieList`,
            method:"get"
        });
        setMovieList(response.data);
    };

    useEffect(()=>{
        loadMovie();
    }, []);

    return (
        <>
            <h1>영화 목록</h1>

            <div className="row mt-4">
                <div className="col">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>감독</th>
                                <th>장르</th>
                                <th>국가</th>
                                <th>출연진</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movieList.map((movie, index)=>(
                                <tr>
                                    <td>{movie.movieNo}</td>
                                    <td>{movie.movieName}</td>
                                    <td>{movie.movieDirector}</td>
                                    <td>{movie.movieNation}</td>
                                    <td>{movie.genreName}</td>
                                    <td>{movie.actorName}</td>
                                    <td>
                                        {/* 아이콘 자리 */}
                                        {/* <LiaEdit className="text-warning"
                                                                onClick={e=>detailMovie(movie)}/>
                                        <AiFillDelete className="text-danger" 
                                                                onClick={e=>moveReview(movie)}/> */}
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

export default Movie;
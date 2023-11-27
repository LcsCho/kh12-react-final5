import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";

const MovieDetail = (props) => {
    const [movie, setMovie] = useState(null);
    const [movieActorRole, setMovieActorRole] = useState(null);
    const [movieGenre, setMovieGenre] = useState(null);
    const [movieMainImage, setMovieMainImage] = useState({ imageUrl: null });
    const [loading, setLoading] = useState(true);
    const [imageList, setImageList] = useState([]);
    const { movieNo } = useParams();
    const location = useLocation();

    const loadMovie = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/rest/movie/movieNo/${movieNo}`);
            setMovie(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const loadMovieActorRole = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/rest/movie/actorInfoList/${movieNo}`);
            setMovieActorRole(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const loadMovieGenre = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/rest/movieGenre/movieNo/${movieNo}`);
            setMovieGenre(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const loadMovieMainImage = async () => {
        try {
            const imageResponse = await axios.get(`${process.env.REACT_APP_REST_API_URL}/rest/image/movieMain/${movieNo}`, {
                responseType: "arraybuffer",
            });

            const blob = new Blob([imageResponse.data], { type: imageResponse.headers["content-type"] });
            const imageUrl = URL.createObjectURL(blob);

            setMovieMainImage({ imageUrl });
        } catch (error) {
            console.error("이미지 불러오기 오류", error);
        }
    };
    // 추가 부분: 이미지 번호 리스트를 가져와서 상태에 설정
    const loadImageList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/rest/movie/imageNoList/${movieNo}`);
            setImageList(response.data);
        } catch (error) {
            console.error("이미지 번호 리스트 불러오기 오류", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([loadMovie(), loadMovieActorRole(), loadMovieGenre(), loadMovieMainImage(), loadImageList()]);

            setLoading(false);
        };

        loadData();
    }, [movieNo]);

    const iconStyle = {
        color: "#B33939",
        opacity: "100%",
    };
    const navLinkStyle = {
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
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                movie && (
                    <>
                        {/* <h1 className="text-center" style={{ color: '#B33939', fontSize: '40px', fontWeight: 'bold' }}>{movie.movieName}({movieNo})</h1> */}
                        <div className="col-md-4">
                            <IconNavLink icon={<AiOutlineUnorderedList style={iconStyle} />} to="/movieList" label="뒤로 가기" />
                        </div>
                        <div className="col text-center">

                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>제목(번호)</th>
                                        <td><h1 className="text-center" style={{ color: '#B33939', fontSize: '40px', fontWeight: 'bold' }}>{movie.movieName}({movieNo})</h1></td>
                                    </tr>
                                    <tr>
                                        <th>포스터</th>
                                        <td>
                                            {movieMainImage.imageUrl ? (
                                                <img
                                                    src={movieMainImage.imageUrl}
                                                    alt={`이미지-${movieMainImage.movieNo}`}
                                                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                                                />
                                            ) : (
                                                <p>이미지 없음</p>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>감독</th>
                                        <td>{movie.movieDirector}</td>
                                    </tr>
                                    <tr>
                                        <th>개봉일</th>
                                        <td>{movie.movieReleaseDate}</td>
                                    </tr>
                                    <tr>
                                        <th>상영 시간</th>
                                        <td>{movie.movieTime}분</td>
                                    </tr>
                                    <tr>
                                        <th>등급</th>
                                        <td>{movie.movieLevel}</td>
                                    </tr>
                                    <tr>
                                        <th>국가</th>
                                        <td>{movie.movieNation}</td>
                                    </tr>
                                    <tr>
                                        <th>내용</th>
                                        <td>{movie.movieContent}</td>
                                    </tr>
                                    <tr>
                                        <th>장르</th>
                                        <td>
                                            {movieGenre && movieGenre.length > 0 ? (
                                                movieGenre.map((genreItem, index) => (
                                                    <span key={index}>
                                                        {index > 0 && "/"}
                                                        {genreItem.genreName}
                                                    </span>
                                                ))
                                            ) : (
                                                <p>장르 정보 없음</p>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>배우 이름(역할)</th>
                                        <td>
                                            {movieActorRole && movieActorRole.length > 0 ? (
                                                movieActorRole.map((actorRoleItem, index) => (
                                                    <span key={index}>
                                                        {index > 0 && ", "}
                                                        {actorRoleItem.actorName}({actorRoleItem.actorRole})
                                                    </span>
                                                ))
                                            ) : (
                                                <p>배우 정보 없음</p>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>갤러리</th>
                                        <td>
                                            <div>
                                                {imageList.map((imageNo) => (
                                                    <img
                                                        key={imageNo}
                                                        src={`${process.env.REACT_APP_REST_API_URL}/rest/image/${imageNo}`}
                                                        alt={`이미지-${imageNo}`}
                                                        style={{ maxWidth: "150px", maxHeight: "150px", margin: "5px" }}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </>
                )
            )}
        </>
    );
};

export default MovieDetail;

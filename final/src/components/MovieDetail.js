import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const MovieDetail = (props) => {
    const [movie, setMovie] = useState(null);
    const [movieActorRole, setMovieActorRole] = useState(null);
    const [movieGenre, setMovieGenre] = useState(null);
    const [movieMainImage, setMovieMainImage] = useState({ imageUrl: null });
    const [loading, setLoading] = useState(true);

    const { movieNo } = useParams();

    const loadMovie = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/movie/movieNo/${movieNo}`);
            setMovie(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const loadMovieActorRole = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/movieActorRole/movieNo/${movieNo}`);
            setMovieActorRole(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const loadMovieGenre = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/movieGenre/movieNo/${movieNo}`);
            setMovieGenre(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    };

    const loadMovieMainImage = async () => {
        try {
            const imageResponse = await axios.get(`${process.env.REACT_APP_REST_API_URL}/image/movieMain/${movieNo}`, {
                responseType: "arraybuffer",
            });

            const blob = new Blob([imageResponse.data], { type: imageResponse.headers["content-type"] });
            const imageUrl = URL.createObjectURL(blob);

            setMovieMainImage({ imageUrl });
        } catch (error) {
            console.error("이미지 불러오기 오류", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([loadMovie(), loadMovieActorRole(), loadMovieGenre(), loadMovieMainImage()]);

            setLoading(false);
        };

        loadData();
    }, [movieNo]);

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                movie && (
                    <>
                        <h1 className="text-center" style={{ color: '#B33939', fontSize: '40px', fontWeight: 'bold' }}>{movie.movieName}</h1>

                        <div className="col text-center">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th>영화 포스터</th>
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
                                        <th>영화 번호</th>
                                        <td>{movie.movieNo}</td>
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
                                                                {actorRoleItem.actorNo}({actorRoleItem.actorRole})
                                                            </span>
                                                        ))
                                            ) : (
                                                <p>배우 정보 없음</p>
                                            )}
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

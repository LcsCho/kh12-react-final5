import axios from "axios";
import { Modal } from "bootstrap";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";

const MovieList = (props) => {
    const location = useLocation();
    const [movieList, setMovieList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [movie, setMovie] = useState({
        movieImage: null,
        movieImageList: null,
        movieName: "",
        movieDirector: "",
        movieReleaseDate: "",
        movieTime: "",
        movieLevel: "",
        movieNation: "",
        movieContent: "",
        genreNameList: "",
        actorNoList: "",
        actorRoleList: "",
    });


    const loadMovie = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/movie/adminMovieList`,
            method: "get",
        });
        setMovieList(response.data);
    };


    const changeMovie = (e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value,
        });
    };
    const clearMovie = () => {
        setMovie({
            movieImage: null,
            movieImageList: null,
            movieName: "",
            movieDirector: "",
            movieReleaseDate: "",
            movieTime: "",
            movieLevel: "",
            movieNation: "",
            movieContent: "",
            genreNameList: "",
            actorNoList: "",
            actorRoleList: ""
        });
    };

    // 영화 삭제
    const deleteMovie = (movie) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        axios({
            url: `${process.env.REACT_APP_REST_API_URL}/movie/${movie.movieNo}`,
            method: "delete",
        })
            .then((response) => {
                loadMovie();
            })
            .catch((err) => { });
    };

    // 영화 등록
    const saveMovie = async () => {
        try {
            const formData = new FormData();
            formData.append("movieName", movie.movieName);
            formData.append("movieImage", movie.movieImage);
            formData.append("movieImageList", movie.movieImageList);
            formData.append("movieDirector", movie.movieDirector);
            formData.append("movieReleaseDate", movie.movieReleaseDate);
            formData.append("movieTime", movie.movieTime);
            formData.append("movieLevel", movie.movieLevel);
            formData.append("movieNation", movie.movieNation);
            formData.append("movieContent", movie.movieContent);
            formData.append("genreNameList", movie.genreNameList);
            formData.append("actorNoList", movie.actorNoList);
            formData.append("actorRoleList", movie.actorRoleList);

            // 영화 모든 것 등록
            const response = await axios.post(
                `${process.env.REACT_APP_REST_API_URL}/movie/upload/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            closeModal();
        } catch (error) {
            console.error("에러 발생", error);
        }
    };



    // 장르 불러오기
    const loadGenre = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/genre/`,
            method: "get"
        });
        setGenreList(response.data);
    }


    const loadMovieDetail = async () => {
        const response = await axios({

        });
    };

    useEffect(() => {
        loadMovie();
        loadGenre();
    }, []);

    // 모달 세팅
    const bsModal = useRef();
    const openModal = () => {
        const modal = new Modal(bsModal.current);
        modal.show();
    };
    const closeModal = () => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
        clearMovie();
    };

    // 장르 세팅
    const [genres, setGenres] = useState([{ genreName: '' }]);


    const addGenreInput = () => {
        setGenres((prevGenres) => [
            ...prevGenres,
            { genreName: '' },
        ]);
    };

    // 배우 세팅
    const [actors, setActors] = useState({
        주연: [],
        조연: [],
        단역: [],
        엑스트라: [],
        특별출연: [],
        우정출연: [],
        성우: [],
    });
    // 섹션 확장 여부를 추적하는 상태
    const [expandedSections, setExpandedSections] = useState({
        주연: false,
        조연: false,
        단역: false,
        엑스트라: false,
        특별출연: false,
        우정출연: false,
        성우: false,
    });

    // 배우 입력 추가 함수
    const addActorInput = (type) => {
        // 배우 상태 업데이트: 새로운 입력 추가
        setActors((prevActors) => ({
            ...prevActors,
            [type]: [...prevActors[type], ''],
        }));
        // 섹션 확장 상태 업데이트: 현재 섹션만 확장되도록 설정
        setExpandedSections((prevExpandedSections) => ({
            ...prevExpandedSections,
            [type]: true,
        }));
    };
    // 배우 입력 값 변경 함수
    const handleActorChange = (e, type, index) => {
        const updatedActors = { ...actors };
        updatedActors[type][index] = e.target.value;
        setActors(updatedActors);
    };


    // 포스터 미리보기 함수
    const [previewImage, setPreviewImage] = useState(null);

    // 포스터가 선택될 때 호출되는 함수
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            // 선택된 파일이 있을 경우 미리보기 업데이트
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setMovie((prevMovie) => ({
                    ...prevMovie,
                    movieImage: selectedFile,
                }));
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewImage(null);
            setMovie((prevMovie) => ({
                ...prevMovie,
                movieImage: null,
            }));
        }
    };


    // 갤러리 이미지 상태
    const [galleryImages, setGalleryImages] = useState([]);

    // 갤러리 이미지 추가 함수
    const addGalleryImageInput = () => {
        setGalleryImages((prevGalleryImages) => [
            ...prevGalleryImages,
            { file: null, preview: null },
        ]);
    };
    // 갤러리 이미지 변경 함수
    const handleGalleryImageChange = (event, index) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            // 선택된 파일이 있을 경우 미리보기 업데이트
            const reader = new FileReader();
            reader.onloadend = () => {
                setGalleryImages((prevGalleryImages) => {
                    const updatedGalleryImages = [...prevGalleryImages];
                    updatedGalleryImages[index] = {
                        file: selectedFile,
                        preview: reader.result,
                    };
                    return updatedGalleryImages;
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>영화 목록</h3>
            <div className="text-end">

                <button className="btn btn-danger" onClick={openModal}>
                    <AiOutlineUnorderedList />영화 등록
                </button>
            </div>

            <div className="row mt-4" >



                <div className="col text-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="5%">번호</th>
                                <th width="20%">제목</th>
                                <th width="15%">감독</th>
                                <th width="10%">개봉일</th>
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
                                    <td><NavLink className={`nav-link ${location.pathname === '/movieDetail' ? 'active' : ''}`}
                                        to="/movieDetail">{movie.movieName}</NavLink></td>
                                    <td>{movie.movieDirector}</td>
                                    <td>{movie.movieReleaseDate}</td>
                                    <td>{movie.genreName}</td>
                                    <td>{movie.movieNation}</td>
                                    <td>{movie.actorName}</td>
                                    <td>
                                        <div className="d-flex container-fluid">
                                            <div className="me-4">
                                                <NavLink className={`nav-link ${location.pathname === '/reviewList' ? 'active' : ''}`}
                                                    to="/reviewList">리뷰</NavLink>
                                            </div>
                                            <div>
                                                <MdOutlineClear className="text-danger" style={{ fontSize: '1.5em' }} onClick={(e) => deleteMovie(movie)} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" ref={bsModal}
                data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" >영화 등록</h5>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            <div className="row"><div className="col">
                                <label className="form-label">제목</label>
                                <input type="text" name="movieName" className="form-control"
                                    value={movie.movieName}
                                    onChange={changeMovie}
                                />
                            </div></div>

                            {/* 영화 포스터 업로드 및 미리보기 부분 시작 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label className="form-label">포스터</label>
                                    <input
                                        type="file"
                                        name="movieImage"
                                        className="form-control"
                                        onChange={handleImageChange}
                                    />
                                    {previewImage && (
                                        <div className="mt-2">
                                            <img
                                                src={previewImage}
                                                alt="미리보기"
                                                className="img-fluid"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* 이미지 업로드 및 미리보기 부분 끝 */}

                            <div className="row mt-4"><div className="col">
                                <label className="form-label">개봉일</label>
                                <input type="date" name="movieReleaseDate" className="form-control"
                                    value={movie.movieReleaseDate}
                                    onChange={changeMovie}
                                />
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label">관람등급</label>
                                <select name="movieLevel" className="form-select"  >
                                    <option value="">선택하세요</option>
                                    <option value={movie.movieLevel} onChange={changeMovie}>전체관람가</option>
                                    <option value={movie.movieLevel} onChange={changeMovie}>12세관람가</option>
                                    <option value={movie.movieLevel} onChange={changeMovie}>15세관람가</option>
                                    <option value={movie.movieLevel} onChange={changeMovie}>청소년관람불가</option>
                                </select>
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label" vlaue={movie.movieDirector} onChange={changeMovie}>감독</label>
                                <input type="text" name="movieDirectro" className="form-control" />
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label" value={movie.movieTime} onChange={changeMovie}>상영시간</label>
                                <input type="number" name="movieTime" className="form-control" />
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label" value={movie.movieNation} onChange={changeMovie}>제작국가</label>
                                <input type="text" name="bookPageCount" className="form-control" />
                            </div></div>

                            <div className="row mt-4">
                                <label className="form-label">장르</label>
                                {genres.map((genre, index) => (
                                    <div key={index} className="col-4">

                                        <select name="genreName" className="form-select">
                                            <option value="">선택하세요</option>
                                            {genreList.map((genre, index) => (
                                                <option key={index} value={genre.genreName} vlaue={movie.genreName} onChange={changeMovie}>
                                                    {genre.genreName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                <div className="col">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={addGenreInput}
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label">줄거리</label>
                                <textarea name="movieContent" className="form-control" value={movie.movieContent} onChange={changeMovie} />
                            </div></div>

                            <div className="row mt-4">
                                {Object.entries(actors).map(([type, actorList]) => (
                                    <div key={type} className="col">
                                        <label className="form-label">{type}</label>
                                        {expandedSections[type] &&
                                            actorList.map((actor, index) => (
                                                <div key={index} className="mb-2">
                                                    <input
                                                        type="text"
                                                        name={`movieActorRole${type}${index}`}
                                                        value={movie.actorRoleList}
                                                        onChange={(e) => handleActorChange(e, type, index)}
                                                        className="form-control"
                                                    />
                                                </div>
                                            ))}
                                        <div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => addActorInput(type)}>
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 갤러리 이미지 부분 시작 */}
                            <div className="row mt-4">
                                {galleryImages.map((galleryImage, index) => (
                                    <div key={index} className="col-4">
                                        <label className="form-label">갤러리 이미지</label>
                                        <input
                                            type="file"
                                            name={`movieImageList${index}`}
                                            className="form-control"
                                            value={movie.movieImageList}
                                            onChange={(e) => handleGalleryImageChange(e, index)}
                                        />
                                        {galleryImage.preview && (
                                            <img
                                                src={galleryImage.preview}
                                                alt={`미리보기 ${index + 1}`}
                                                className="img-fluid mt-2"
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="col-4">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={addGalleryImageInput}
                                    >
                                        갤러리 이미지 추가
                                    </button>
                                </div>
                            </div>
                            {/* 갤러리 이미지 부분 끝 */}
                        </div>
                        <div className="modal-footer">
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    닫기
                                </button>
                                {/* {movie.movieNo === undefined && */}
                                <button className="btn btn-success" onClick={saveMovie}>
                                    저장
                                </button>
                                {/* } */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MovieList;
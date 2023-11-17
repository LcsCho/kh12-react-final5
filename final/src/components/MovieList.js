import axios from "axios";
import { Modal } from "bootstrap";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";
import { debounce } from 'lodash';

const MovieList = (props) => {
    const location = useLocation();
    const [movieList, setMovieList] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [actorImageList, setActorImageList] = useState([]);
    const fileChooser = useRef();
    const fileChoosers = useRef();


    const [selectedMovie, setSelectedMovie] = useState(null);

    // const openMovieDetailsModal = (movie) => {
    //     setSelectedMovie(movie);
    //     openModal();
    // };
    const [movie, setMovie] = useState({
        movieImage: null,
        movieImageList: [],
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



    // 장르, 배우, 갤러리 이미지 닫기 버튼 구현
    const removeGenreInput = (index) => {
        setGenres((prevGenres) => prevGenres.filter((_, i) => i !== index));
    };

    const removeActorInput = (type, index) => {
        setActors((prevActors) => {
            const updatedActors = { ...prevActors };
            updatedActors[type] = prevActors[type].filter((_, i) => i !== index);
            return updatedActors;
        });
    };

    const removeGalleryImageInput = (index) => {
        setGalleryImages((prevGalleryImages) => {
            const updatedGalleryImages = prevGalleryImages.filter((_, i) => i !== index);
            return updatedGalleryImages;
        });
    };


    const loadMovie = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/movie/adminMovieList`,
            method: "get",
        });
        setMovieList(response.data);
    };

    const changeMovie = (e) => {
        setMovie((prevMovie) => {
            if (e.target.name === 'genreNameList') {
                return {
                    ...prevMovie,
                    [e.target.name]: [
                        ...prevMovie.genreNameList.slice(0, e.target.dataset.index),
                        e.target.value,
                        ...prevMovie.genreNameList.slice(e.target.dataset.index + 1),
                    ],
                };
            } else if (e.target.name === 'actorNoList' || e.target.name === 'actorRoleList') {
                const [type, index] = e.target.dataset.index.split('-');
                const updatedActors = { ...prevMovie[e.target.name] };
                updatedActors[index] = e.target.value;
                return {
                    ...prevMovie,
                    [e.target.name]: { ...prevMovie[e.target.name], ...updatedActors },
                };
            } else {
                return {
                    ...prevMovie,
                    [e.target.name]: e.target.value,
                };
            }
        });
    };
    const clearMovie = () => {
        setMovie({
            movieImage: null,
            movieImageList: [],
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


        clearMovieImage();
        clearMovieImages();
        setGalleryImages([{ file: null, preview: null }]);
        setGenres([{ genreName: '' }]);
        setActors({
            주연: [],
            조연: [],
            단역: [],
            엑스트라: [],
            특별출연: [],
            우정출연: [],
            성우: [],
        });
        setExpandedSections({
            주연: false,
            조연: false,
            단역: false,
            엑스트라: false,
            특별출연: false,
            우정출연: false,
            성우: false,
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


    const saveMovie = async () => {
        try {
            if (
                !movie.movieName ||
                !movie.movieDirector ||
                !movie.movieReleaseDate ||
                !movie.movieTime ||
                !movie.movieLevel ||
                !movie.movieNation ||
                !movie.movieContent ||
                !previewImage.file ||
                genres.length === 0 || // Check if at least one genre is selected
                !Object.values(actors).some((actorList) => actorList.length > 0) // Check if at least one actor is provided in any category
            ) {
                alert("모든 값을 입력해주세요!");
                return;
            }

            const formData = new FormData();

            // 영화 제목, 영화 이미지, 영화 감독, 영화 개봉일, 영화 상영 시간, 영화 등급, 영화 국가, 영화 내용, 영화 장르 추가
            formData.append("movieName", movie.movieName);
            formData.append("movieDirector", movie.movieDirector);
            formData.append("movieReleaseDate", movie.movieReleaseDate);
            formData.append("movieTime", movie.movieTime);
            formData.append("movieLevel", movie.movieLevel);
            formData.append("movieNation", movie.movieNation);
            formData.append("movieContent", movie.movieContent);

            //FormData를 만들 때 서버에서 List로 수신하게 하려면 같은 이름으로 낱개를 계속 추가해야 한다.
            formData.append("movieImage", previewImage.file);
            // formData.append("movieImageList", galleryImages);

            // 영화 이미지 목록 추가
            galleryImages.map(img => img.file).forEach(img => formData.append("movieImageList", img));
            // 영화 장르 추가
            genres.map(genre => genre.genreName).forEach(genreName => formData.append("genreNameList", genreName));

            // 배우 번호 목록 추가
            // 배우는 번호따로 역할따로 순서맞게
            // {주연: [], 조연: [], 단역: [], 엑스트라: [], 특별출연: [], 우정출연: [], 성우: []}
            Object.keys(actors).forEach(key => {
                const array = actors[key];
                array.forEach(no => {
                    formData.append("actorNoList", no);
                    formData.append("actorRoleList", key);
                });
            });

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



    useEffect(() => {
        loadSearch();
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





    // 입력에 딜레이를 주기 위해 만든 코드
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
        };
    };

    // 배우 입력 값 변경 함수
    const handleActorChange = async(e, type, index) => {
        const actorName = e.target.value;
        console.log(actorName);
        if (actorName) {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_REST_API_URL}/actor/findImageNoByActorName/${actorName}`
                );
                // response에서 이미지 번호 리스트를 추출하여 state에 저장
                setActorImageList(response.data);
            } catch (error) {
                console.error('API 호출 에러', error);
            }
        }
        console.log(actorImageList);


        // const updatedActors = { ...actors };
        // updatedActors[type][index] = actorName;
        // setActors(updatedActors);

        console.log(type, actorName);
        setActors(prev=>({
            ...prev,
            [type]:prev[type].map((t, i)=>{
                if(i === index) {
                    return actorName;
                }
                return t;
            })
        }));
    };

    const handleActorChangeDebounced = debounce(handleActorChange, 1000);

    // 포스터 미리보기 함수
    const [previewImage, setPreviewImage] = useState({ file: null, preview: null });

    // 포스터가 선택될 때 호출되는 함수
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            // 선택된 파일이 있을 경우 미리보기 업데이트
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage({ file: selectedFile, preview: reader.result });
            };
            reader.readAsDataURL(selectedFile);
        } else {
            fileChooser.current.value = "";//실제 태그 초기화 
            setPreviewImage(null);
            setMovie((prevMovie) => ({
                ...prevMovie,
                movieImage: null,
            }));

        }
    };


    // 갤러리 이미지 상태
    const [galleryImages, setGalleryImages] = useState([{ file: null, preview: null }]);


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
                    return prevGalleryImages.map((image, i) => {
                        if (i === index) {
                            return {
                                file: selectedFile,
                                preview: reader.result
                            };
                        }
                        return image;
                    });
                });
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    //장르 변경 함수
    const changeGenre = (e, index) => {
        const selectedGenre = e.target.value;
        // Check if the selected genre is already chosen
        const isGenreSelected = genres.some((genre, i) => i !== index && genre.genreName === selectedGenre);

        if (!isGenreSelected) {
            const newGenres = genres.map((genre, i) => {
                if (i === index) {
                    return { genreName: selectedGenre }
                }
                return genre;
            });
            setGenres(newGenres);
        } else {
            // Handle the case where the genre is already selected (e.g., show a warning)
            alert("장르를 중복선택할 수 없습니다!");
        }
    };
    // const changeGenre = (e, index) => {
    //     const newGenres = genres.map((genre, i) => {
    //         if (i === index) {
    //             return { genreName: e.target.value }
    //         }
    //         return genre;
    //     });
    //     setGenres(newGenres);
    // };

    const clearMovieImage = e => {
        fileChooser.current.value = "";
        setPreviewImage({ file: null, preview: null });
    };
    const clearMovieImages = e => {
        fileChoosers.current.value = "";
        setGalleryImages({ file: null, preview: null });
    };

    // 영화 제목 검색 코드
    const [movieName, setMovieName] = useState('');
    const loadSearch = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/movie/adminSearch/${movieName}`,
                method: "get",
                params: {
                    movieName: movieName,
                },
            });
            setMovieList(response.data);

        } catch (error) {
            console.error('검색 오류', error);
        }
    };

    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>영화 목록</h3>
            <div className="text-center mt-3 d-flex align-items-center justify-content-center">
                <input
                    type="text"
                    placeholder="영화 제목을 입력하여 검색"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    className="form-control me-2"
                />
                <button className="btn btn-danger h-100" onClick={loadSearch}>
                    검색
                </button>
            </div>
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
                                    <td>
                                        <div className="row">
                                            <NavLink
                                                className={`nav-link ${location.pathname === `/movieDetail/${movie.movieNo}` ? 'active' : ''}`}
                                                to={`/movieDetail/${movie.movieNo}`}
                                            >
                                                {movie.movieName}
                                            </NavLink>
                                        </div>
                                    </td>
                                    <td>{movie.movieDirector}</td>
                                    <td>{movie.movieReleaseDate}</td>
                                    <td>{movie.genreName}</td>
                                    <td>{movie.movieNation}</td>
                                    <td>{movie.actorName}</td>
                                    <td>
                                        <div className="row">
                                            <div>
                                                <MdOutlineClear className="text-danger" style={{fontSize:'30px'}}onClick={(e) => deleteMovie(movie)} />
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
                                        ref={fileChooser}
                                    />
                                    {previewImage && (
                                        <div className="mt-2">
                                            <img
                                                src={previewImage.preview}
                                                // alt="미리보기"
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
                                <select name="movieLevel" className="form-select" value={movie.movieLevel} onChange={changeMovie}>
                                    <option value="">선택하세요</option>
                                    <option>전체관람가</option>
                                    <option>12세관람가</option>
                                    <option>15세관람가</option>
                                    <option>청소년관람불가</option>
                                </select>
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label" >감독</label>
                                <input type="text" name="movieDirector" className="form-control" value={movie.movieDirector} onChange={changeMovie} />
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label" >상영시간</label>
                                <input type="number" name="movieTime" className="form-control" value={movie.movieTime} onChange={changeMovie} />
                            </div></div>

                            <div className="row mt-4"><div className="col">
                                <label className="form-label" >제작국가</label>
                                <input type="text" name="movieNation" className="form-control" value={movie.movieNation} onChange={changeMovie} />
                            </div></div>

                            {/* 장르 등록 */}
                            <div className="row mt-4">
                                <label className="form-label">장르</label>
                                {genres.map((genre, index) => (
                                    <div key={index} className="col-4">
                                        <select
                                            name="genreNameList"
                                            className="form-select"
                                            value={genre.genreName}
                                            onChange={(e) => changeGenre(e, index)}
                                            data-index={index}
                                        >
                                            <option value="">선택하세요</option>
                                            {genreList.map((genre, index) => (
                                                <option key={index}>
                                                    {genre.genreName}
                                                </option>
                                            ))}
                                        </select>
                                        {index !== 0 && (<button
                                            className="btn btn-danger mt-2"
                                            onClick={() => removeGenreInput(index)}
                                        >
                                            삭제
                                        </button>
                                        )}
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

                            {actorImageList.map((imageNo) => (
                                    <div key={imageNo}>
                                        {imageNo}
                                    </div>
                            ))}
                            {/* 배우 번호로 등록 */}
                            <div className="row mt-4">
                                {Object.entries(actors).map(([type, actorList]) => (
                                    <div key={type} className="col">
                                        <label className="form-label" name="actorRoleList" value={movie.actorRoleList}>{type}</label>
                                        {expandedSections[type] &&
                                            actorList.map((actor, index) => (
                                                <div key={index} className="mb-2" value={movie.actorNoList}>
                                                    <input
                                                        type="text"
                                                        name="actorNoList"
                                                        value={actorList[index] || ''}
                                                        onChange={(e) => handleActorChangeDebounced(e, type, index)}
                                                        className="form-control"
                                                        // ref={fileChooser}
                                                    />
                                                    <button
                                                        className="btn btn-danger mt-2"
                                                        onClick={() => removeActorInput(type, index)}
                                                    >
                                                        삭제
                                                    </button>
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
                                    <div key={index} className="col-4" value={movie.movieImageList} name="movieImageList">
                                        <label className="form-label">갤러리 이미지</label>
                                        {index == 0 ?
                                            <input
                                                type="file"
                                                name="movieImageList"
                                                className="form-control"
                                                ref={fileChoosers}
                                                onChange={(e) => handleGalleryImageChange(e, index)}
                                            /> :
                                            <input
                                                type="file"
                                                name="movieImageList"
                                                className="form-control"
                                                onChange={(e) => handleGalleryImageChange(e, index)}
                                            />
                                        }

                                        {galleryImage.preview && (
                                            <img
                                                src={galleryImage.preview}
                                                alt={`미리보기 ${index + 1}`}
                                                className="img-fluid mt-2"
                                            />
                                        )}
                                        {index !== 0 && (
                                            <button
                                                className="btn btn-danger mt-2"
                                                onClick={() => removeGalleryImageInput(index)}
                                            >
                                                삭제
                                            </button>
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
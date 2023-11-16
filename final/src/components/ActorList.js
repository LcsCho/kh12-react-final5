import axios from "axios";
import { Modal } from "bootstrap";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { LiaEdit } from "react-icons/lia";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const ActorList = (props) => {

    const [actorList, setActorList] = useState([]);

    const fileChooser = useRef();

    const loadActor = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/actor/`,
                method: "get",
            });

            // 각 배우에 대한 이미지를 불러오고 actorList를 업데이트
            const updatedActorList = await Promise.all(response.data.map(async (actor) => {
                const imageUrl = await loadActorImage(actor.actorNo);
                return { ...actor, imageUrl };
            }));

            setActorList(updatedActorList);
        } catch (error) {
            console.error("오류남", error);
        }
    };
    const loadActorImage = async (actorNo) => {
        try {
            const imageResponse = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/image/actor/${actorNo}`,
                method: "get",
                responseType: "arraybuffer", // 이 부분은 이미지 데이터를 바이너리 형식으로 받기 위한 설정입니다.
            });

            // 이미지 데이터를 Blob으로 변환
            const blob = new Blob([imageResponse.data], { type: imageResponse.headers['content-type'] });

            // Blob을 URL로 변환
            const imageUrl = URL.createObjectURL(blob);

            return imageUrl;
        } catch (error) {
            console.error("Failed to load actor image:", error);
            return null;
        }
    };

    useEffect(() => {
        loadActor();
        loadSearch();
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
        clearActor();
        // clearActorImage();
    };

    const deleteActor = (actor) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        axios({
            url: `${process.env.REACT_APP_REST_API_URL}/actor/${actor.actorNo}`,
            method: "delete"
        })
            .then(response => {
                loadActor();
            })
            .catch(err => { });
    };

    const [actor, setActor] = useState({
        //모달에서 입력했을 때  값을 받을 부분
        actorName: "",
        actorImage: null, // 파일 선택을 위한 상태

    });

    const clearActor = () => {
        // actor 상태 초기화
        setActor({
            actorName: "",
            actorImage: null,
        });
        fileChooser.current.value = "";//실제 태그 초기화
        setPreviewImage(null);
    };

    const changeActor = (e) => {
        setActor({
            ...actor,
            [e.target.name]: e.target.value,
        });
    }

    // const clearActorImage = ()=>{
    //     setActor({
    //         actorName: "",
    //         actorImage: null,
    //     });
    //     fileChooser.current.value = "";//실제 태그 초기화
    //     setPreviewImage(null);
    // };

    const saveActor = async () => {
        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append("actorName", actor.actorName);
            formData.append("actorImage", actor.actorImage);

            // actor 정보와 이미지를 함께 서버로 전송
            const response = await axios.post(
                `${process.env.REACT_APP_REST_API_URL}/actor/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // 등록 후 목록을 다시 불러오기
            loadActor();
            closeModal(); // 모달 닫기


        } catch (error) {
            console.error("Failed to save actor:", error);
        }
    };


    // 배우 미리보기 함수
    const [previewImage, setPreviewImage] = useState(null);

    // 이미지가 선택될 때 호출되는 함수
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {

            // 선택된 파일이 있을 경우 파일 정보를 저장
            setActor({
                ...actor,
                actorImage: selectedFile,
            });

            // 선택된 파일이 있을 경우 미리보기 업데이트
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setActor({
                ...actor,
                actorImage: null,

            });
            fileChooser.current.value = "";//실제 태그 초기화                
            setPreviewImage(null);
        }
    };

    //수정

    const editActor = async (target) => {
        // 배우 정보를 모달에 표시하기 전에 불러오기
        const { actorNo } = target;

        // actorNo를 사용하여 배우 정보와 이미지 정보를 불러오기
        // 해당 정보를 state에 업데이트하고 모달 열기
        loadActorDetails(actorNo);
        openModal();
    };
    const loadActorDetails = async (actorNo) => {
        try {
            // 배우 정보를 불러오는 API 호출
            const actorResponse = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/actor/findByActorNo/${actorNo}`,
                method: "get",
            });


            // 비어있을 경우 처리
            if (!actorResponse.data || actorResponse.data.length === 0) {
                console.error("비어있어요");
                // 원하는 처리를 여기에 추가 (예: 에러 메시지 표시 등)
                return;
            }


            // 이미지 정보를 불러오는 API 호출
            const imageResponse = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/image/actor/${actorNo}`,
                method: "get",
                responseType: "arraybuffer",
            });
            console.log(imageResponse);

            const actorImage = imageResponse.data ? new Blob([imageResponse.data], { type: imageResponse.headers['content-type'] }) : null;;
            // 배우 정보와 이미지 정보를 state에 업데이트
            setActor({
                actorNo: actorResponse.data.actorNo,
                actorName: actorResponse.data.actorName,
                actorImage: null,//이미지를 set 하진 않고 미리보기만
            });

            // 불러온 이미지를 미리보기로 업데이트
            setPreviewImage(URL.createObjectURL(actorImage));

        } catch (error) {
            console.error("Failed to load actor details:", error);
        }
    };

    //수정 비동기
    const updateActor = async () => {
        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append("actorName", actor.actorName);
            console.log(actor.actorName);

            // actor 이미지가 변경된 경우에만 FormData에 추가
            if (actor.actorImage != null && actor.actorImage instanceof Blob) {
                formData.append("actorImage", actor.actorImage);
                console.log(actor.actorImage);
            }

            // actor 정보와 이미지를 함께 서버로 전송
            const response = await axios.put(
                `${process.env.REACT_APP_REST_API_URL}/actor/editActor/${actor.actorNo}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // 수정 후 목록을 다시 불러오기
            loadActor();
            closeModal(); // 모달 닫기
        } catch (error) {
            console.error("실패", error);
        }
    };

    // 배우 이름 검색 코드
    const [actorName, setActorName] = useState('');
    const loadSearch = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/actor/adminSearch/${actorName}`,
                method: "get",
                params: {
                    actorName: actorName,
                },
            });
            setActorList(response.data);

        } catch (error) {
            console.error('검색 오류', error);
        }
    };

    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>배우 목록</h3>
            <div className="text-center mt-3 d-flex align-items-center justify-content-center">
                <input
                    type="text"
                    placeholder="배우이름을 입력하여 검색"
                    value={actorName}
                    onChange={(e) => setActorName(e.target.value)}
                    className="form-control me-2"
                />
                <button className="btn btn-danger h-100" onClick={loadSearch}>
                    검색
                </button>
            </div>
            <div className="text-end">
                <button className="btn btn-danger" onClick={openModal}>
                    <AiOutlineUnorderedList />배우 등록
                </button>
            </div>

            <div className="row mt-4" >



                <div className="col text-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="10%">번호</th>
                                <th width="20%">이름</th>
                                <th width="60%">이미지</th>
                                <th width="10%">관리</th>

                            </tr>
                        </thead>
                        <tbody>
                            {actorList.map((actor, index) => (
                                <tr key={index}>
                                    <td>{actor.actorNo}</td>
                                    <td>{actor.actorName}</td>
                                    <td>
                                        {actor.imageUrl ? (
                                            <img
                                                src={actor.imageUrl}
                                                alt={`이미지-${actor.actorNo}`}
                                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                                            />
                                        ) : (
                                            <FaUser style={{maxWidth: "100px", maxHeight: "100px"}}/>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex container-fluid">
                                            <div style={{ fontSize: "25px" }}>
                                                <LiaEdit className="text-warning"
                                                    onClick={(e) => editActor(actor)}
                                                />
                                            </div>
                                            <div>
                                                <MdOutlineClear
                                                    className="text-danger"
                                                    style={{ fontSize: "25px" }}
                                                    onClick={(e) => deleteActor(actor)}
                                                />
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
                            <h5 className="modal-title" >배우 등록</h5>
                        </div>
                        <div className="modal-body">
                            <div className="row"><div className="col">
                                <label className="form-label">이름</label>
                                <input type="text" name="actorName" className="form-control"
                                    value={actor.actorName}
                                    onChange={changeActor}
                                />
                            </div></div>

                            {/* 배우 이미지 업로드 및 미리보기 부분 시작 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label className="form-label">이미지</label>
                                    <input
                                        type="file"
                                        name="actorImage"
                                        className="form-control"
                                        onChange={handleImageChange}
                                        ref={fileChooser}
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
                            {/* 배우 이미지 업로드 및 미리보기 부분 끝 */}


                        </div>
                        <div className="modal-footer">
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>
                                    닫기
                                </button>
                                {actor.actorNo === undefined ?
                                    <button className="btn btn-success" onClick={saveActor}>
                                        저장
                                    </button>
                                    :
                                    <button className="btn btn-success" onClick={updateActor}>
                                        수정
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ActorList;
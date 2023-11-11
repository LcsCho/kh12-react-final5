import axios from "axios";
import { Modal } from "bootstrap";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { LiaEdit } from "react-icons/lia";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";

const ActorList = (props) => {
    const location = useLocation();
    const [actorList, setActorList] = useState([]);
    const [actorImageListByActorNo, setActorImageListByActorNo] = useState([]);
    // 배우 미리보기 함수
    const [previewImage, setPreviewImage] = useState(null);

    // 이미지가 선택될 때 호출되는 함수
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            // 선택된 파일이 있을 경우 미리보기 업데이트
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewImage(null);
        }
    };


    const loadActor = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/actor/`,
                method: "get"
            });
            setActorList(response.data);

            // Load images for each actor
            const actorImages = await Promise.all(
                response.data.map(async (actor) => {
                    const imageResponse = await axios({
                        url: `${process.env.REACT_APP_REST_API_URL}/image/${actor.actorNo}`,
                        method: "get",
                    });
                    return {
                        actorNo: actor.actorNo,
                        imageData: imageResponse.data
                    };

                })

            );
            console.log(actorImages);
            setActorImageListByActorNo(actorImages);
        } catch (error) {
            console.error("배우 이미지를 불러올 수 없습니다.", error);
        }


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

    useEffect(() => {
        loadActor();
    }, []);

    useEffect(() => {
        loadActor();
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
    };

    // 등록
    const [actor, setActor] = useState({ actorNo: "", actorName: "", actorImage: "" });
    const changeActor = (e) => {
        const { name, value, files } = e.target;

        if (name === "actorName") {
            setActor({
                ...actor,
                [name]: value,
            });
        } else if (name === "actorImage" && files.length > 0) {
            // 이미지 파일이 변경되었을 때의 로직
            const selectedFile = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setActor({
                    ...actor,
                    actorImage: selectedFile,
                });
            };

            reader.readAsDataURL(selectedFile);
        }
    };
    const clearActor = () => {
        setActor({ actorName: "", actorImage: "" });
    }

    const saveActor = () => {
        // Create FormData object
        const formData = new FormData();
        formData.append("actorImage", actor.actorImage);

        axios({
            url: `${process.env.REACT_APP_REST_API_URL}/actor/`,
            method: "post",
            data: {
                actorName: actor.actorName,
                formData
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                loadActor();
                closeModal();
            })
            .catch((error) => {
                console.error("Error saving actor:", error);
                // Log the detailed error response for debugging
                console.log("Error response:", error.response);
            });
    };

    return (
        <>

            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>배우 목록</h3>
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
                                        {actorImageListByActorNo.find(
                                            (item) => item.actorNo === actor.actorNo
                                        ) ? (
                                            <img
                                                src={`data:${actorImageListByActorNo.find(
                                                    (item) => item.actorNo === actor.actorNo
                                                ).imageData.contentType};base64,${actorImageListByActorNo.find(
                                                    (item) => item.actorNo === actor.actorNo
                                                ).imageData.data}`}
                                                className="img-fluid"
                                            />
                                        ) : (
                                            "이미지 없음"
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex container-fluid">
                                            <div style={{ fontSize: "25px" }}>
                                                <LiaEdit className="text-warning" />
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
                            <h5 className="modal-title" > {actor.actorNo === undefined ?
                                '신규 배우 등록' : `${actor.actorNo}번 배우 수정`}</h5>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            <div className="row"><div className="col">
                                <label className="form-label">이름</label>
                                <input type="text" name="actorName" className="form-control" value={actor.actorName} onChange={changeActor} />
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
                                {/* {actor.actorNo === undefined && */}
                                <button className="btn btn-success" onClick={saveActor}>
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

export default ActorList;
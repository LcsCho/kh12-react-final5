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

    const loadActor = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/actor/`,
            method: "get"
        });
        setActorList(response.data);
    };

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
                                <tr>
                                    <td>{actor.actorNo}</td>
                                    <td>{actor.actorName}</td>
                                    <td>{actor.actorImage}</td>
                                    <td>
                                        <div className="d-flex container-fluid">
                                            <div className="me-4">
                                                <LiaEdit className="text-warning"  />
                                            </div>
                                            <div>
                                                <MdOutlineClear className="text-danger" style={{ fontSize: '1.5em' }} />
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
                            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            <div className="row"><div className="col">
                                <label className="form-label">이름</label>
                                <input type="text" name="actorName" className="form-control" />
                            </div></div>

                            {/* 배우 이미지 업로드 및 미리보기 부분 시작 */}
                            <div className="row mt-4">
                                <div className="col">
                                    <label className="form-label">이미지</label>
                                    <input
                                        type="file"
                                        name="imageNo"
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
                                <button className="btn btn-success">
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
import axios from "axios";
import { Modal } from "bootstrap";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { LiaEdit } from "react-icons/lia";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";

const MemberList = (props) => {
    const location = useLocation();
    const [memberList, setMemberList] = useState([]);
    const [editableMemberId, setEditableMemberId] = useState(null);
    const [editedMemberLevel, setEditedMemberLevel] = useState('');

    const loadMember = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/member/`,
            method: "get"
        });
        setMemberList(response.data);
    };

    const [originalMemberLevel, setOriginalMemberLevel] = useState('');

    const handleEditClick = (memberId, memberLevel) => {
        setEditableMemberId(memberId);
        setEditedMemberLevel(memberLevel);
        setOriginalMemberLevel(memberLevel);
    };

    const handleCancelClick = () => {
        setEditableMemberId(null);
        setEditedMemberLevel('');
        setOriginalMemberLevel('');
    };

    const handleLevelChange = (e) => {
        setEditedMemberLevel(e.target.value);
    };

    const updateMember = async (memberId) => {
        try {
            await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/member/${memberId}`,
                method: "patch",
                data: {
                    memberLevel: editedMemberLevel
                }
            });
            setEditableMemberId(null);
            setEditedMemberLevel('');
            setOriginalMemberLevel('');
            loadMember();
        } catch (error) {
            console.error("Error updating member level:", error);
        }
    };

     // 회원 검색 코드
     const [memberNickname, setMemberNickname] = useState('');
     const loadSearch = async () => {
         try {
             const response = await axios({
                 url: `${process.env.REACT_APP_REST_API_URL}/member/adminSearch/${memberNickname}`,
                 method: "get",
                 params: {
                     memberNickname: memberNickname,
                 },
             });
             setMemberList(response.data);
 
         } catch (error) {
             console.error('검색 오류', error);
         }
     };

    useEffect(() => {
        loadMember();
        loadSearch();
    }, []);

    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>회원 목록</h3>
            <div className="text-center mt-3 d-flex align-items-center justify-content-center" style={{marginBottom:"80px"}}>
                <input
                    type="text"
                    placeholder="회원 닉네임을 입력하여 검색"
                    value={memberNickname}
                    onChange={(e) => setMemberNickname(e.target.value)}  
                    className="form-control me-2"
                    style={{width:'400px'}}
                />
                <button className="btn btn-danger h-100" onClick={loadSearch} style={{lineHeight:"2"}}>
                    검색
                </button>
            </div>
            <div className="row mt-4">
                <div className="col text-center">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th width="25%">아이디</th>
                                <th width="15%">닉네임</th>
                                <th width="15%">연락처</th>
                                <th width="15%">생년월일</th>
                                <th width="10%">가입일</th>
                                <th width="5%">성별</th>
                                <th width="15%">등급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberList.map((member, index) => (
                                <tr key={index}>
                                    <td>{member.memberId}</td>
                                    <td>{member.memberNickname}</td>
                                    <td>{member.memberContact}</td>
                                    <td>{member.memberBirth}</td>
                                    <td>{member.memberJoin}</td>
                                    <td>{member.memberGender}</td>
                                    <td>
                                        <div className="row ms-2">
                                            {editableMemberId === member.memberId ? (
                                                <div className="row mx-auto">
                                                    <select className="form-select form-select-sm" 
                                                        value={editedMemberLevel}
                                                        onChange={handleLevelChange}
                                                    >
                                                        <option value="일반">일반</option>
                                                        <option value="평론가">평론가</option>
                                                        <option value="관리자">관리자</option>
                                                    </select>
                                                        <button className="btn btn-success btn-sm mt-2" onClick={() => updateMember(member.memberId)}>수정</button>
                                                        <button className="btn btn-secondary btn-sm mt-2" onClick={handleCancelClick}>취소</button>
                                                </div>
                                            ) : (
                                                <div className="row mx-auto">
                                                    <button className="btn btn-danger" onClick={() => handleEditClick(member.memberId, member.memberLevel)}>{member.memberLevel}
                                                    </button>
                                                </div>
                                            )}
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

export default MemberList;

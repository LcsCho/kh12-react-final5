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

    const loadMember = async () => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/member/`,
            method: "get"
        });
        setMemberList(response.data);
    };

    useEffect(() => {
        loadMember();
    }, []);
    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>회원 목록</h3>

            <div className="row mt-4" >



                <div className="col text-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="30%">아이디</th>
                                <th width="20%">닉네임</th>
                                <th width="15%">연락처</th>
                                <th width="15%">생년월일</th>
                                <th width="10%">가입일</th>
                                <th width="5%">성별</th>
                                <th width="5%">등급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberList.map((member, index) => (
                                <tr>
                                    <td>{member.memberId}</td>
                                    <td>{member.memberNickname}</td>
                                    <td>{member.memberContact}</td>
                                    <td>{member.memberBirth}</td>
                                    <td>{member.memberJoin}</td>
                                    <td>{member.memberGender}</td>
                                    <td>{member.memberLevel}</td>
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
import { useState } from "react";
import { useLocation } from "react-router";

const MemberList = (props) => {

    const location = useLocation();
    const [memberList, setMemberList] = useState([]);

    const loadActor = async () => {
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
            <h1>회원 목록</h1>

            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>회원 목록</h3>

            <div className="row mt-4" >



                <div className="col text-center">
                    <table className="table">
                        <thead>
                            <tr>
                                <th width="20%">아이디</th>
                                <th width="10%">닉네임</th>
                                <th width="15%">연락처</th>
                                <th width="15%">생년월일</th>
                                <th width="20%">가입일</th>
                                <th width="5%">성별</th>
                                <th width="5%">등급</th>
                                <th width="10%">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberList.map((member, index) => (
                                <tr>
                                    <td>{member.memberId}</td>
                                    <td>{member.member}</td>
                                    <td>{member.memberImage}</td>
                                    <td>{member.memberImage}</td>
                                    <td>{member.memberImage}</td>
                                    <td>{member.memberImage}</td>
                                    <td>{member.memberImage}</td>
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
        </>
    );
};

export default MemberList;
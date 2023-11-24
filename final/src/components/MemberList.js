import axios from "axios";

import { Modal } from "bootstrap";
import { AiOutlinePlus, AiOutlineUnorderedList } from "react-icons/ai";
import { LiaEdit } from "react-icons/lia";
import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";
import "./List.css";



const MemberList = (props) => {
    const [memberList, setMemberList] = useState([]);
    const [editableMemberId, setEditableMemberId] = useState(null);
    const [editedMemberLevel, setEditedMemberLevel] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalMembers, setTotalMembers] = useState(0);
    const [startPage, setStartPage] = useState(1);

    const totalPages = Math.ceil(totalMembers / pageSize);
    const maxButtons = 10;

    // 검색에 대한 페이지네이션을 위한 새로운 state 변수
    const [searchCurrentPage, setSearchCurrentPage] = useState(1);
    const [searchPageSize, setSearchPageSize] = useState(15);
    const [searchTotalPages, setSearchTotalPages] = useState(0);
    const [searchTotalMembers, setSearchTotalMembers] = useState(0);
    const [searchStartPage, setSearchStartPage] = useState(1);
    const [memberNickname, setMemberNickname] = useState('');
    const searchMaxButtons = 10;

    // 기존 검색 중 여부 확인을 통한 렌더링
    const isSearching = !!memberNickname;


    const loadMember = async (page = currentPage, size = pageSize) => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/member/page/${currentPage}/size/${pageSize}`,
            method: "get",
            params: {
                page: currentPage,
                size: pageSize,
            },
        });
        setMemberList(response.data);
    };

    const loadTotalMembers = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/member/memberCount`,
                method: "get",
            });
            setTotalMembers(response.data);
        } catch (error) {
            console.error("전체 회원 수를 불러오는 중 오류 발생:", error);
        }
    };

    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            await loadMember(page);
            setCurrentPage(page);
        }
    };

    const handleNextButtonClick = () => {
        const nextPage = Math.min(totalPages, currentPage + 1);

        if (nextPage > startPage + maxButtons - 1) {
            setStartPage(startPage + maxButtons);
        }

        setCurrentPage(nextPage);
    };

    const handlePrevButtonClick = () => {
        const prevPage = Math.max(1, currentPage - 1);

        if (prevPage < startPage) {
            setStartPage(Math.max(1, startPage - maxButtons));
        }

        setCurrentPage(prevPage);
    };

    const renderPaginationButtons = () => {
        const buttons = [];

        const endPage = Math.min(startPage + maxButtons - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
                    <button type="button" className="page-link" onClick={() => handlePageChange(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        return buttons;
    };

    //검색
    const loadSearch = async (page = searchCurrentPage, size = searchPageSize) => {
        try {
            if (!memberNickname) {
                // 검색어가 없으면 처리를 중단하거나 초기 상태로 돌아갈 수 있습니다.
                return;
            }

            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/member/adminSearch/${memberNickname}/page/${page}/size/${size}`,
                method: "get",
                params: {
                    memberNickname: memberNickname,
                    page: page,
                    size: size,
                },
            });
            setMemberList(response.data);
        } catch (error) {
            console.error('검색 오류', error);
        }
    };

    const loadSearchTotalMembers = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/member/searchCount/${memberNickname}`,
                method: "get",
                params: {
                    memberNickname: memberNickname
                },
            });
            setSearchTotalPages(Math.ceil(response.data / pageSize));
        } catch (error) {
            console.error("검색된 회원 수를 불러오는 중 오류 발생:", error);
        }
    };

    const handleSearchPageChange = async (page) => {
        if (page >= 1 && page <= searchTotalPages && page !== searchCurrentPage) {
            await loadSearch(page);
            setSearchCurrentPage(page);
        }
    };

    const handleSearchNextButtonClick = async () => {
        const nextPage = Math.min(searchTotalPages, searchCurrentPage + 1);

        if (nextPage > searchStartPage + searchMaxButtons - 1) {
            setSearchStartPage(searchStartPage + searchMaxButtons);
        }

        await loadSearch(nextPage);
        setSearchCurrentPage(nextPage);
    };



    const handleSearchPrevButtonClick = async () => {
        const prevPage = Math.max(1, searchCurrentPage - 1);

        if (prevPage < searchStartPage) {
            setSearchStartPage(Math.max(1, searchStartPage - searchMaxButtons));
        }

        await loadSearch(prevPage);
        setSearchCurrentPage(prevPage);
    };

    const renderSearchPaginationButtons = () => {
        const buttons = [];

        const endPage = Math.min(searchStartPage + searchMaxButtons - 1, searchTotalPages);

        for (let i = searchStartPage; i <= endPage; i++) {
            buttons.push(
                <li key={i} className={`page-item ${searchCurrentPage === i ? "active" : ""}`}>
                    <button type="button" className="page-link" onClick={() => handleSearchPageChange(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        return buttons;
    };

    useEffect(() => {
        // 검색이 아닐 때 전체 회원 리스트 데이터 로드
        if (!memberNickname) {
            loadMember();
            loadTotalMembers();
        }
        // 검색일 때 검색한 회원 리스트 데이터 로드
        else {
            // loadSearch();
            loadSearchTotalMembers();
        }
    }, [currentPage, pageSize, searchCurrentPage, searchPageSize, memberNickname]);

    // useEffect(() => {
    //     loadMember();
    //     // loadSearch();  // 이 부분을 주석 처리하거나 제거
    //     loadTotalMembers();
    //     // 검색 페이지네이션 데이터 로드
    //     loadSearchTotalMembers();
    // }, [currentPage, pageSize, searchCurrentPage, memberNickname]);

    const [originalMemberLevel, setOriginalMemberLevel] = useState("");

    const handleEditClick = (memberId, memberLevel) => {
        setEditableMemberId(memberId);
        setEditedMemberLevel(memberLevel);
        setOriginalMemberLevel(memberLevel);
    };

    const handleCancelClick = () => {
        setEditableMemberId(null);
        setEditedMemberLevel("");
        setOriginalMemberLevel("");
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
                    memberLevel: editedMemberLevel,
                },
            });
            setEditableMemberId(null);
            setEditedMemberLevel("");
            setOriginalMemberLevel("");
            loadMember();
        } catch (error) {
            console.error("회원 등급 업데이트 오류:", error);
        }
    };

    // 검색어 입력 이벤트 핸들러
    const handleSearchInputChange = (e) => {
        setMemberNickname(e.target.value);
    };

    // 검색 버튼 클릭 이벤트 핸들러
    const handleSearchButtonClick = async () => {
        setSearchStartPage(1)
        setSearchCurrentPage(1);
        await loadSearch(1);
        await loadSearchTotalMembers();
    };

    // Enter 키 입력 이벤트 핸들러
    const handleSearchInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchButtonClick();
        }
    };

    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>회원 목록</h3>
            <div className="text-center mt-3 d-flex align-items-center justify-content-center" style={{ marginBottom: "80px" }}>
                <input
                    type="text"
                    placeholder="회원 닉네임을 입력하여 검색"
                    value={memberNickname}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchInputKeyPress}
                    className="form-control me-2"
                    style={{ width: '400px' }}
                />
                <button className="btn btn-danger h-100" onClick={handleSearchButtonClick} style={{ lineHeight: "2" }}>
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
                                <th className="pc-only" width="15%">연락처</th>
                                <th className="pc-only" width="15%">생년월일</th>
                                <th className="pc-only" width="10%">가입일</th>
                                <th width="5%">성별</th>
                                <th width="15%">등급</th>
                                <th></th>
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
                                                <div className="row me-2">
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
                    <div>
                        {/* 전체 리스트일 때만 네비게이터 렌더링 */}
                        {!isSearching && (
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button type="button" className="page-link" onClick={handlePrevButtonClick}>
                                        &laquo;
                                    </button>
                                </li>
                                {renderPaginationButtons()}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button type="button" className="page-link" onClick={handleNextButtonClick}>
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        )}

                        {/* 검색 중일 때만 네비게이터 렌더링 */}
                        {isSearching && (
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${searchCurrentPage === 1 ? "disabled" : ""}`}>
                                    <button type="button" className="page-link" onClick={handleSearchPrevButtonClick}>
                                        &laquo;
                                    </button>
                                </li>
                                {renderSearchPaginationButtons()}
                                <li className={`page-item ${searchCurrentPage === searchTotalPages ? "disabled" : ""}`}>
                                    <button type="button" className="page-link" onClick={handleSearchNextButtonClick}>
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberList;

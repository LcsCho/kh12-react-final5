import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";

const ReviewList = (props) => {
    const location = useLocation();
    const [reviewList, setReviewList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [totalReviews, setTotalReviews] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const totalPages = Math.ceil(totalReviews / pageSize);
    const maxButtons = 10;

    // const loadReview = async (page = currentPage, size = pageSize) => {
    //     try {
    //         const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/rest/review/adminReviewList`);
    //         setReviewList(response.data);
    //     } catch (error) {
    //         console.error("에러 발생", error);
    //     }
    // }

    //전체 리뷰 리스트
    const loadReview = async (page = currentPage, size = pageSize) => {
        const response = await axios({
            url: `${process.env.REACT_APP_REST_API_URL}/rest/review/page/${currentPage}/size/${pageSize}`,
            method: "get",
            params: {
                page: currentPage,
                size: pageSize,
            },
        });
        setReviewList(response.data);
    };
    
    //전체 리뷰수
    const loadTotalReviews = async () => {
        try {
            const response = await axios({
                url: `${process.env.REACT_APP_REST_API_URL}/rest/review/reviewCount`,
                method: "get",
            });
            setTotalReviews(response.data);
        } catch (error) {
            console.error("전체 리뷰 수를 불러오는 중 오류 발생:", error);
        }
    };

    //현재 페이지 계산
    const handlePageChange = async (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            await loadReview(page);
            setCurrentPage(page);
        }
    };

    //다음 버튼
    const handleNextButtonClick = () => {
        const nextPage = Math.min(totalPages, currentPage + 1);

        if (nextPage > startPage + maxButtons - 1) {
            setStartPage(startPage + maxButtons);
        }
        setCurrentPage(nextPage);
    };

    //이전 버튼
    const handlePrevButtonClick = () => {
        const prevPage = Math.max(1, currentPage - 1);

        if (prevPage < startPage) {
            setStartPage(Math.max(1, startPage - maxButtons));
        }
        setCurrentPage(prevPage);
    };

    //네비게이터
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

    //리뷰 삭제
    const deleteReview = (review) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        axios({
            url: `${process.env.REACT_APP_REST_API_URL}/review/${review.reviewNo}`,
            method: "delete"
        })
            .then(response => {
                loadReview();
            })
            .catch(err => { });
    }

    useEffect(() => {
        loadReview();
        loadTotalReviews();
    }, [currentPage, pageSize]);

    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>리뷰 목록</h3>

            <div className="row mt-4" >
                <div className="col text-center">
                    <table className="table table-hover">
                        <thead>
                            <tr className="table-danger">
                                <th width="20%">영화 제목</th>
                                <th width="10%">리뷰 번호</th>
                                <th width="15%">작성자</th>
                                <th width="30%">리뷰내용</th>
                                <th width="15%">작성 시각</th>
                                <th width="10%">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewList.map((review, index) => (
                                <tr>
                                    <td>{review.movieName}</td>
                                    <td>{review.reviewNo}</td>
                                    <td>{review.memberNickname}</td>
                                    <td>{review.reviewContent}</td>
                                    <td>{review.reviewDate}</td>
                                    <td>
                                        <div className="row">
                                            <div>
                                                <MdOutlineClear className="text-danger" style={{ fontSize: '30px' }} onClick={(e) => deleteReview(review)} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
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
                    </div>

                </div>
            </div>
        </>
    );
};

export default ReviewList;
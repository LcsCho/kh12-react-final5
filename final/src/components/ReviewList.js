import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdOutlineClear } from "react-icons/md";

const ReviewList = (props) => {
    const location = useLocation();
    const [reviewList, setReviewList] = useState([]);

    const loadReview = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_REST_API_URL}/review/adminReviewList`);
            setReviewList(response.data);
        } catch (error) {
            console.error("에러 발생", error);
        }
    }

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
    }, []);

    return (
        <>
            <h3 style={{ color: '#B33939', marginTop: '50px', marginBottom: '50px' }}>리뷰 목록</h3>

            <div className="row mt-4" >
                <div className="col text-center">
                    <table className="table table-hover">
                        <thead>
                            <tr>
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
                </div>
            </div>
        </>
    );
};

export default ReviewList;
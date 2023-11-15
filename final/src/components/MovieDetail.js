import { useParams } from "react-router";

const MovieDetail = (props) => {
    const { movieNo } = useParams();
    return (
        <>
            <h1>{movieNo}번 영화 상세</h1>
        </>
    );
};

export default MovieDetail;
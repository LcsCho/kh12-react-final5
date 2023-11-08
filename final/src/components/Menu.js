import { NavLink, useLocation } from "react-router-dom";
import mvcImage from '../assets/images/mvc.png';
import { useState } from "react";

const Menu = (props) => {
    const location = useLocation();
    // console.log(location.pathname);
    const [widthSize, setWidthSize] = useState(150);
    const [heightSize, setHeigthSize] = useState(80);


    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-white fixed-top">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/"><img src={mvcImage} width={widthSize} height={heightSize}/></NavLink>
                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
                </div>
            </nav>
        </>
    );
};

export default Menu;

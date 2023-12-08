import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';


const Menu = (props) => {
    const location = useLocation();
    const [widthSize, setWidthSize] = useState(150);
    const [heightSize, setHeigthSize] = useState(80);

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        // 스크롤이 발생하면 여기에서 필요한 동작을 수행
        // 예: 메뉴 크기 변경, 특정 클래스 추가/제거 등
        const scrollY = window.scrollY;

        if (scrollY > 0) {
            setWidthSize(100); // 스크롤이 발생하면 메뉴 크기를 줄임
            setHeigthSize(50);
        } else {
            setWidthSize(150); // 스크롤이 상단에 도달하면 원래 크기로 복원
            setHeigthSize(80);
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (정리 함수)
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // 빈 배열을 전달하여 최초 한 번만 실행되도록 함

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-white fixed-top">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <h1>to Main</h1>
                    </NavLink>
                </div>
            </nav>
        </>
    );
};

export default Menu;
// src/components/ui/PagedProfileGrid.tsx
import React, { useState } from 'react';
import type { Participant } from '../../services/participantService';
import './PagedProfileGrid.css';

interface PagedProfileGridProps {
    participants: Participant[];
}

const ITEMS_PER_PAGE = 20;

const PagedProfileGrid: React.FC<PagedProfileGridProps> = ({ participants }) => {
    const [pageIndex, setPageIndex] = useState(0);

    if (!participants || participants.length === 0) {
        return (
            <div className="paged-grid-container">
                <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>참여자가 없습니다.</div>
            </div>
        );
    }

    // 정렬 함수: 한글(원로회 등) 우선, 그 뒤에 숫자(1회, 2회...) 자연 정렬
    const customSort = (a: Participant, b: Participant) => {
        const seasonA = a.season || '';
        const seasonB = b.season || '';

        const isDigitA = /^\d/.test(seasonA);
        const isDigitB = /^\d/.test(seasonB);

        // 둘 다 숫자로 시작하면 자연 정렬 (1, 2, 10...)
        if (isDigitA && isDigitB) {
            return seasonA.localeCompare(seasonB, undefined, { numeric: true, sensitivity: 'base' });
        }

        // 하나만 숫자로 시작하면, 숫자가 아닌 쪽(한글)이 앞으로
        if (isDigitA && !isDigitB) return 1;
        if (!isDigitA && isDigitB) return -1;

        // 둘 다 문자면 가나다순
        return seasonA.localeCompare(seasonB);
    };

    const sortedParticipants = [...participants].sort(customSort);
    const totalPages = Math.ceil(sortedParticipants.length / ITEMS_PER_PAGE);

    // 현재 페이지에 보여줄 데이터 슬라이싱
    const currentParticipants = sortedParticipants.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);

    const handlePrev = () => {
        if (pageIndex > 0) setPageIndex(pageIndex - 1);
    };

    const handleNext = () => {
        if (pageIndex < totalPages - 1) setPageIndex(pageIndex + 1);
    };

    return (
        <div className="paged-grid-wrapper">
            <button className="nav-btn" onClick={handlePrev} disabled={pageIndex === 0} aria-label="Previous Page">
                &#10094;
            </button>

            <div className="paged-grid-container">
                <div className="paged-profiles-grid">
                    {currentParticipants.map((p) => (
                        <div key={p.id} className="profile-card">
                            {p.profile?.imageUrl ? (
                                <img src={p.profile.imageUrl} alt={p.name} className="profile-img" />
                            ) : (
                                <div className="profile-img default-profile-img">{p.name.charAt(0)}</div>
                            )}
                            <span className="profile-name">{p.name}</span>
                            <span className="profile-position">{p.position}</span>
                            <span className="profile-season">{p.season}</span>
                        </div>
                    ))}
                </div>

                <div className="page-indicator">
                    {pageIndex + 1} / {totalPages}
                </div>
            </div>

            <button
                className="nav-btn"
                onClick={handleNext}
                disabled={pageIndex === totalPages - 1}
                aria-label="Next Page"
            >
                &#10095;
            </button>
        </div>
    );
};

export default PagedProfileGrid;

import React, { useState } from 'react';
import type { Participant } from '../../services/participantService';
import './GroupedProfileSlider.css';

interface GroupedData {
    season: string;
    participants: Participant[];
}

interface GroupedProfileSliderProps {
    groups: GroupedData[];
    size?: 'normal' | 'large';
}

const ITEMS_PER_PAGE = 20;

const GroupedProfileSlider: React.FC<GroupedProfileSliderProps> = ({ groups, size = 'normal' }) => {
    const [groupIndex, setGroupIndex] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);

    if (!groups || groups.length === 0) {
        return (
            <div className="grouped-slider-container">
                <div className="no-participants">참여자가 없습니다.</div>
            </div>
        );
    }

    const currentGroup = groups[groupIndex];
    const totalPages = Math.ceil(currentGroup.participants.length / ITEMS_PER_PAGE);

    // Ensure pageIndex is valid when group changes
    if (pageIndex >= totalPages && totalPages > 0) {
        setPageIndex(totalPages - 1);
    }

    const currentParticipants = currentGroup.participants.slice(
        pageIndex * ITEMS_PER_PAGE,
        (pageIndex + 1) * ITEMS_PER_PAGE,
    );

    const handlePrev = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        } else {
            // Go to previous group
            const newGroupIndex = groupIndex === 0 ? groups.length - 1 : groupIndex - 1;
            setGroupIndex(newGroupIndex);
            // Go to last page of the new group
            const newGroup = groups[newGroupIndex];
            const newTotalPages = Math.ceil(newGroup.participants.length / ITEMS_PER_PAGE);
            setPageIndex(newTotalPages > 0 ? newTotalPages - 1 : 0);
        }
    };

    const handleNext = () => {
        if (pageIndex < totalPages - 1) {
            setPageIndex(pageIndex + 1);
        } else {
            // Go to next group
            setGroupIndex(groupIndex === groups.length - 1 ? 0 : groupIndex + 1);
            setPageIndex(0);
        }
    };

    return (
        <div className={`grouped-slider-container ${size}`}>
            <div className="slider-header">
                <h2 className="slider-season-title">
                    {currentGroup.season}
                    <span
                        style={{
                            fontSize: '0.6em',
                            color: '#666',
                            marginLeft: '10px',
                            fontWeight: 'normal',
                            display: 'block',
                            marginTop: '5px',
                        }}
                    >
                        {currentGroup.participants.map((p) => p.name).join(', ')}
                    </span>
                </h2>
            </div>

            <div className="slider-body">
                <button className="slider-nav-btn nav-prev" onClick={handlePrev} aria-label="Previous">
                    &#10094;
                </button>

                <div className="slider-content">
                    <div className="profiles-grid">
                        {currentParticipants.map((p) => (
                            <div key={p.id} className="profile-card">
                                {p.profile?.imageUrl ? (
                                    <img src={p.profile.imageUrl} alt={p.name} className="profile-img" />
                                ) : (
                                    <div className="profile-img default-profile-img">{p.name.charAt(0)}</div>
                                )}
                                <span className="profile-name">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="slider-nav-btn nav-next" onClick={handleNext} aria-label="Next">
                    &#10095;
                </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '10px', color: '#888' }}>
                {totalPages > 1 && `${pageIndex + 1} / ${totalPages}`}
            </div>
        </div>
    );
};

export default GroupedProfileSlider;

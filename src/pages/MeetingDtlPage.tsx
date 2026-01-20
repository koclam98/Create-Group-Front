import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Table } from '../components/ui/Table';
import '../app/App.css';
import '../styles/common.css';
import { ParticipantService, type Participant, type Meeting } from '../services/participantService';
import { meetingService } from '../services/meetingService';

export default function MeetingDtlPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const isNew = location.state?.isNew;
    const { id } = useParams<{ id: string }>();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formdata, setFormData] = useState({
        title: '',
        desc: '',
        createAt: '',
        updateAt: '',
    });

    const [attendees, setAttendees] = useState<Participant[]>([]);
    const [nonAttendees, setNonAttendees] = useState<Participant[]>([]);

    const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);
    const [selectedNonAttendeeIds, setSelectedNonAttendeeIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParti, setSearchParti] = useState('');

    const filteredNonAttendees = nonAttendees.filter(
        (p) => p.name.includes(searchTerm) || p.season.includes(searchTerm),
    );

    const filteredAttendees = attendees.filter((p) => p.name.includes(searchParti) || p.season.includes(searchParti));

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [meetingData, allParticipants] = await Promise.all([
                    meetingService.getById(id),
                    ParticipantService.getAll(),
                ]);

                setMeeting(meetingData);
                setFormData({
                    title: meetingData.title,
                    desc: meetingData.desc,
                    createAt: meetingData.createdAt,
                    updateAt: meetingData.updatedAt,
                });

                if (meetingData.participants) {
                    const attendeeIds = meetingData.participants.map((p) => p.id);
                    setAttendees(meetingData.participants);
                    setNonAttendees(allParticipants.filter((p) => !attendeeIds.includes(p.id)));
                } else {
                    setAttendees([]);
                    setNonAttendees(allParticipants);
                }
            } catch (err) {
                console.error('Failed to fetch data: ', err);
                setError('데이터를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleUpdate = async () => {
        if (!id || !meeting) return;
        try {
            await meetingService.update(id, formdata);

            alert('수정되었습니다.');
            const updated = await meetingService.getById(id);
            setMeeting(updated);
            navigate('/list');
        } catch (err) {
            console.error('Failed to update meeting: ', err);
            alert('수정실패');
        }
    };

    const handleMainScreen = async () => {
        if (!id || !meeting) return;
        try {
            await meetingService.update(id, formdata);
            navigate('/', { state: { meetingId: id } });
        } catch (err) {
            console.error('Failed to update meeting: ', err);
            alert('저장 실패했습니다.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSelectAllAttendees = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAttendeeIds(filteredAttendees.map((p) => p.id));
        } else {
            setSelectedAttendeeIds([]);
        }
    };

    const handleSelectAttendeeRow = (id: string) => {
        if (selectedAttendeeIds.includes(id)) {
            setSelectedAttendeeIds(selectedAttendeeIds.filter((sid) => sid !== id));
        } else {
            setSelectedAttendeeIds([...selectedAttendeeIds, id]);
        }
    };

    const handleSelectAllNonAttendees = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedNonAttendeeIds(filteredNonAttendees.map((p) => p.id));
        } else {
            setSelectedNonAttendeeIds([]);
        }
    };

    const handleSelectNonAttendeeRow = (id: string) => {
        if (selectedNonAttendeeIds.includes(id)) {
            setSelectedNonAttendeeIds(selectedNonAttendeeIds.filter((sid) => sid !== id));
        } else {
            setSelectedNonAttendeeIds([...selectedNonAttendeeIds, id]);
        }
    };

    const handleAddSelected = async () => {
        if (!meeting) return;
        if (selectedNonAttendeeIds.length === 0) {
            alert('추가할 참여자를 선택해주세요.');
            return;
        }

        const prevAttendees = [...attendees];
        const prevNonAttendees = [...nonAttendees];
        const prevSelectedNonAttendeeIds = [...selectedNonAttendeeIds];

        try {
            const itemsToAdd = nonAttendees.filter((p) => selectedNonAttendeeIds.includes(p.id));

            const newAttendees = [...attendees, ...itemsToAdd];
            const newNonAttendees = nonAttendees.filter((p) => !selectedNonAttendeeIds.includes(p.id));

            setAttendees(newAttendees);
            setNonAttendees(newNonAttendees);
            setSelectedNonAttendeeIds([]);

            const currentAttendeeIds = attendees.map((p) => p.id);
            const newIdsToAdd = selectedNonAttendeeIds.filter((id) => !currentAttendeeIds.includes(id));
            const newParticipantIds = [...currentAttendeeIds, ...newIdsToAdd];

            const updatedMeeting = await meetingService.update(meeting.id, { participantIds: newParticipantIds });
            setMeeting(updatedMeeting);
        } catch (error) {
            console.error('Failed to add participants:', error);
            alert('참여자 추가에 실패했습니다. 변경사항을 되돌립니다.');

            setAttendees(prevAttendees);
            setNonAttendees(prevNonAttendees);
            setSelectedNonAttendeeIds(prevSelectedNonAttendeeIds);
        }
    };

    const handleRemoveSelected = async () => {
        if (!meeting) return;
        if (selectedAttendeeIds.length === 0) {
            alert('제외할 참여자를 선택해주세요.');
            return;
        }

        const prevAttendees = [...attendees];
        const prevNonAttendees = [...nonAttendees];
        const prevSelectedAttendeeIds = [...selectedAttendeeIds];

        try {
            const itemsToRemove = attendees.filter((p) => selectedAttendeeIds.includes(p.id));

            const newAttendees = attendees.filter((p) => !selectedAttendeeIds.includes(p.id));
            const newNonAttendees = [...nonAttendees, ...itemsToRemove];

            setAttendees(newAttendees);
            setNonAttendees(newNonAttendees);
            setSelectedAttendeeIds([]);

            const newParticipantIds = newAttendees.map((p) => p.id);

            const updatedMeeting = await meetingService.update(meeting.id, { participantIds: newParticipantIds });
            setMeeting(updatedMeeting);
        } catch (error) {
            console.error('Failed to remove participants:', error);
            alert('참여자 제외에 실패했습니다. 변경사항을 되돌립니다.');

            setAttendees(prevAttendees);
            setNonAttendees(prevNonAttendees);
            setSelectedAttendeeIds(prevSelectedAttendeeIds);
        }
    };

    const isAllAttendeesSelected =
        filteredAttendees.length > 0 && selectedAttendeeIds.length === filteredAttendees.length;
    const isAllNonAttendeesSelected =
        filteredNonAttendees.length > 0 && selectedNonAttendeeIds.length === filteredNonAttendees.length;

    // 참가자 그룹핑 함수
    const groupParticipantsBySeason = (participants: Participant[]) => {
        const groups: { [key: string]: Participant[] } = {};
        participants.forEach((p) => {
            const season = p.season || '기타';
            if (!groups[season]) {
                groups[season] = [];
            }
            groups[season].push(p);
        });
        return Object.keys(groups)
            .sort((a, b) => {
                const isDigitA = /^\d/.test(a);
                const isDigitB = /^\d/.test(b);

                if (isDigitA && isDigitB) {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                }

                if (isDigitA && !isDigitB) return 1;
                if (!isDigitA && isDigitB) return -1;

                return a.localeCompare(b);
            })
            .map((season) => ({
                season,
                participants: groups[season],
            }));
    };

    const groupedAttendees = groupParticipantsBySeason(filteredAttendees);
    const groupedNonAttendees = groupParticipantsBySeason(filteredNonAttendees);

    const commonColumns = (
        isAllSelected: boolean,
        onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void,
        itemIds: string[],
        onSelectRow: (id: string) => void,
    ) => [
        {
            header: (
                <input type="checkbox" checked={isAllSelected} onChange={onSelectAll} className="checkbox-medium" />
            ),
            accessor: 'id' as keyof Participant,
            width: '15%',
            render: (row: Participant) => (
                <input
                    type="checkbox"
                    checked={itemIds.includes(row.id)}
                    onChange={() => onSelectRow(row.id)}
                    className="checkbox-medium"
                />
            ),
        },
        { header: '이름', accessor: 'name' as keyof Participant, width: '55%' },
        { header: '기수', accessor: 'season' as keyof Participant, width: '30%' },
    ];

    if (loading) {
        return (
            <main className="main-content loading-container">
                <p>로딩 중...</p>
            </main>
        );
    }

    if (error || !meeting) {
        return (
            <main className="main-content loading-container">
                <p className="error-text">{error || '모임을 찾울 수 없습니다.'}</p>
                <button onClick={() => navigate('/list')} className="mt-1">
                    목록으로 돌아가기
                </button>
            </main>
        );
    }

    return (
        <main className="main-content">
            <h1 className="section-header">모임 상세</h1>

            <div className="form-container">
                <div className="form-group">
                    <label className="form-label">모임명</label>
                    <input
                        type="text"
                        name="title"
                        value={formdata.title}
                        onChange={(e) => setFormData({ ...formdata, title: e.target.value })}
                        className="form-input-editable"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">모임 설명</label>
                    <input
                        type="text"
                        name="desc"
                        value={formdata.desc}
                        onChange={(e) => setFormData({ ...formdata, desc: e.target.value })}
                        className="form-input-editable"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">모임 생성일</label>
                    <input type="text" value={formatDate(formdata.createAt)} className="form-input" readOnly />
                </div>
                <div className="form-group">
                    <label className="form-label">모임 수정일</label>
                    <input type="text" value={formatDate(formdata.updateAt)} className="form-input" readOnly />
                </div>

                <div className="button-group">
                    <button className="button-flex-1" onClick={handleMainScreen}>
                        {isNew ? '등록' : '수정하기'}
                    </button>
                    <button className="button-flex-1" onClick={() => navigate('/list')}>
                        목록으로
                    </button>
                </div>
            </div>

            <div className="section-split">
                <div className="section-half">
                    <h2 className="mb-1" style={{ color: '#007bff' }}>
                        참석자 ({filteredAttendees.length})
                    </h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="이름/기수 검색"
                            value={searchParti}
                            onChange={(e) => setSearchParti(e.target.value)}
                            className="search-input"
                        />
                        <div className="search-button-container">
                            <button
                                onClick={handleRemoveSelected}
                                disabled={selectedAttendeeIds.length === 0}
                                className={`button-small ${
                                    selectedAttendeeIds.length === 0 ? 'button-disabled' : 'button-danger'
                                }`}
                            >
                                선택 제외 ({selectedAttendeeIds.length})
                            </button>
                        </div>
                    </div>
                    <div className="table-container" style={{ width: '80%' }}>
                        <div
                            style={{
                                maxHeight: '380px',
                                overflowY: 'auto',
                                borderRadius: '8px',
                            }}
                        >
                            {/* Sticky Header */}
                            <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff' }}>
                                <Table
                                    columns={commonColumns(
                                        isAllAttendeesSelected,
                                        handleSelectAllAttendees,
                                        selectedAttendeeIds,
                                        handleSelectAttendeeRow,
                                    )}
                                    data={[]}
                                    containerStyle={{
                                        width: '100%',
                                        borderRadius: 0,
                                        borderBottom: '1px solid #e2e8f0',
                                    }}
                                    noScroll={true}
                                />
                            </div>
                            {/* Grouped Tables */}
                            {groupedAttendees.map((group) => (
                                <div key={group.season}>
                                    <div
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#f1f5f9',
                                            fontWeight: 'bold',
                                            borderLeft: '4px solid #007bff',
                                            borderBottom: '1px solid #e2e8f0',
                                        }}
                                    >
                                        {group.season} ({group.participants.length})
                                    </div>
                                    <Table
                                        columns={commonColumns(
                                            isAllAttendeesSelected,
                                            handleSelectAllAttendees,
                                            selectedAttendeeIds,
                                            handleSelectAttendeeRow,
                                        )}
                                        data={group.participants}
                                        containerStyle={{ width: '100%', borderRadius: 0 }}
                                        hideHeader={true}
                                        noScroll={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="section-half">
                    <h2 className="mb-1" style={{ color: '#6c757d' }}>
                        미참석자 ({filteredNonAttendees.length})
                    </h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="이름/기수 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <div className="search-button-container">
                            <button
                                onClick={handleAddSelected}
                                disabled={selectedNonAttendeeIds.length === 0}
                                className={`button-small ${
                                    selectedNonAttendeeIds.length === 0 ? 'button-disabled' : 'button-success'
                                }`}
                            >
                                선택 추가 ({selectedNonAttendeeIds.length})
                            </button>
                        </div>
                    </div>
                    <div className="table-container" style={{ width: '80%' }}>
                        <div
                            style={{
                                maxHeight: '380px',
                                overflowY: 'auto',
                                borderRadius: '8px',
                            }}
                        >
                            {/* Sticky Header */}
                            <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff' }}>
                                <Table
                                    columns={commonColumns(
                                        isAllNonAttendeesSelected,
                                        handleSelectAllNonAttendees,
                                        selectedNonAttendeeIds,
                                        handleSelectNonAttendeeRow,
                                    )}
                                    data={[]}
                                    containerStyle={{
                                        width: '100%',
                                        borderRadius: 0,
                                        borderBottom: '1px solid #e2e8f0',
                                    }}
                                    noScroll={true}
                                />
                            </div>
                            {/* Grouped Tables */}
                            {groupedNonAttendees.map((group) => (
                                <div key={group.season}>
                                    <div
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#f1f5f9',
                                            fontWeight: 'bold',
                                            borderLeft: '4px solid #6c757d',
                                            borderBottom: '1px solid #e2e8f0',
                                        }}
                                    >
                                        {group.season} ({group.participants.length})
                                    </div>
                                    <Table
                                        columns={commonColumns(
                                            isAllNonAttendeesSelected,
                                            handleSelectAllNonAttendees,
                                            selectedNonAttendeeIds,
                                            handleSelectNonAttendeeRow,
                                        )}
                                        data={group.participants}
                                        containerStyle={{ width: '100%', borderRadius: 0 }}
                                        hideHeader={true}
                                        noScroll={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

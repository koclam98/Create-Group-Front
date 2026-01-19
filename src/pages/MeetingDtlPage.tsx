import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Table } from '../components/ui/Table';
import '../app/App.css';
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

    // 체크박스 선택 상태
    const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);
    const [selectedNonAttendeeIds, setSelectedNonAttendeeIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParti, setSearchParti] = useState('');

    const filteredNonAttendees = nonAttendees.filter(
        (p) => p.name.includes(searchTerm) || p.season.includes(searchTerm)
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
                // 모임 정보와 전체 참여자 목록을 병렬로 조회
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

                // 참석자 및 미참석자 분류
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
            // alert('저장 후 메인으로 이동합니다.'); // Optional: notify user
            navigate('/', { state: { meetingId: id } });
        } catch (err) {
            console.error('Failed to update meeting: ', err);
            alert('저장 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                <p>로딩 중...</p>
            </main>
        );
    }
    if (error || !meeting) {
        return (
            <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                <p style={{ color: 'red' }}>{error || '모임을 찾울 수 없습니다.'}</p>
                <button onClick={() => navigate('/list')} style={{ marginTop: '1rem' }}>
                    목록으로 돌아가기
                </button>
            </main>
        );
    }

    const inputStyle = {
        flex: 1,
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#ffffff', // Editable look
        color: '#333',
    };

    const labelStyle = {
        width: '100px',
        textAlign: 'right' as const,
        fontWeight: 'bold',
    };

    const formtDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 참석자 체크박스 핸들러
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

    // 미참석자 체크박스 핸들러
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

    // 선택된 미참석자 추가 (Bulk Add)
    const handleAddSelected = async () => {
        if (!meeting) return;
        if (selectedNonAttendeeIds.length === 0) {
            alert('추가할 참여자를 선택해주세요.');
            return;
        }

        // 이전 상태 백업 (롤백용)
        const prevAttendees = [...attendees];
        const prevNonAttendees = [...nonAttendees];
        const prevSelectedNonAttendeeIds = [...selectedNonAttendeeIds];

        try {
            // 1. Optimistic Update (UI 즉시 반영)
            const itemsToAdd = nonAttendees.filter((p) => selectedNonAttendeeIds.includes(p.id));

            const newAttendees = [...attendees, ...itemsToAdd];
            const newNonAttendees = nonAttendees.filter((p) => !selectedNonAttendeeIds.includes(p.id));

            setAttendees(newAttendees);
            setNonAttendees(newNonAttendees);
            setSelectedNonAttendeeIds([]);

            // 2. Server Sync
            const currentAttendeeIds = attendees.map((p) => p.id);
            const newIdsToAdd = selectedNonAttendeeIds.filter((id) => !currentAttendeeIds.includes(id));
            const newParticipantIds = [...currentAttendeeIds, ...newIdsToAdd];

            const updatedMeeting = await meetingService.update(meeting.id, { participantIds: newParticipantIds });

            // 서버 응답으로 최종 동기화
            setMeeting(updatedMeeting);
            // 만약 서버 처리가 로컬 로직과 다를 수 있다면 아래 주석 해제하여 서버 데이터로 덮어쓰기
            /*
            const serverAttendees = updatedMeeting.participants;
            setAttendees(serverAttendees);
            const serverAttendeeIds = serverAttendees.map(p => p.id);
            const allParticipants = [...prevAttendees, ...prevNonAttendees]; // 전체 목록
            setNonAttendees(allParticipants.filter(p => !serverAttendeeIds.includes(p.id)));
            */
        } catch (error) {
            console.error('Failed to add participants:', error);
            alert('참여자 추가에 실패했습니다. 변경사항을 되돌립니다.');

            // Revert state
            setAttendees(prevAttendees);
            setNonAttendees(prevNonAttendees);
            setSelectedNonAttendeeIds(prevSelectedNonAttendeeIds);
        }
    };

    // 선택된 참석자 삭제 (Bulk Remove)
    const handleRemoveSelected = async () => {
        if (!meeting) return;
        if (selectedAttendeeIds.length === 0) {
            alert('제외할 참여자를 선택해주세요.');
            return;
        }

        // 이전 상태 백업
        const prevAttendees = [...attendees];
        const prevNonAttendees = [...nonAttendees];
        const prevSelectedAttendeeIds = [...selectedAttendeeIds];

        try {
            // 1. Optimistic Update (UI 즉시 반영)
            const itemsToRemove = attendees.filter((p) => selectedAttendeeIds.includes(p.id));

            const newAttendees = attendees.filter((p) => !selectedAttendeeIds.includes(p.id));
            const newNonAttendees = [...nonAttendees, ...itemsToRemove];

            setAttendees(newAttendees);
            setNonAttendees(newNonAttendees);
            setSelectedAttendeeIds([]);

            // 2. Server Sync
            const newParticipantIds = newAttendees.map((p) => p.id);

            const updatedMeeting = await meetingService.update(meeting.id, { participantIds: newParticipantIds });
            setMeeting(updatedMeeting);
        } catch (error) {
            console.error('Failed to remove participants:', error);
            alert('참여자 제외에 실패했습니다. 변경사항을 되돌립니다.');

            // Revert
            setAttendees(prevAttendees);
            setNonAttendees(prevNonAttendees);
            setSelectedAttendeeIds(prevSelectedAttendeeIds);
        }
    };

    const isAllAttendeesSelected =
        filteredAttendees.length > 0 && selectedAttendeeIds.length === filteredAttendees.length;
    const isAllNonAttendeesSelected =
        filteredNonAttendees.length > 0 && selectedNonAttendeeIds.length === filteredNonAttendees.length;

    return (
        <main className="main-content">
            <h1 style={{ marginBottom: '2rem' }}>모임 상세</h1>

            <div
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임명</label>
                    <input
                        type="text"
                        name="title"
                        value={formdata.title}
                        onChange={(e) => setFormData({ ...formdata, title: e.target.value })}
                        style={inputStyle}
                    />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임 설명</label>
                    <input
                        type="text"
                        name="desc"
                        value={formdata.desc}
                        onChange={(e) => setFormData({ ...formdata, desc: e.target.value })}
                        style={inputStyle}
                    />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임 생성일</label>
                    <input type="text" value={formtDate(formdata.createAt)} style={inputStyle} readOnly />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={labelStyle}>모임 수정일</label>
                    <input type="text" value={formtDate(formdata.updateAt)} style={inputStyle} readOnly />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button style={{ flex: 1 }} onClick={handleMainScreen}>
                        {isNew ? '등록' : '수정하기'}
                    </button>
                    <button style={{ flex: 1 }} onClick={() => navigate('/list')}>
                        목록으로
                    </button>
                </div>
            </div>

            {/* 참석자 / 미참석자 분할 영역 */}
            <div
                style={{
                    width: '100%',
                    maxWidth: '1000px',
                    display: 'flex',
                    gap: '2rem',
                    marginTop: '3rem',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
            >
                {/* 왼쪽: 참석자 목록 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ marginBottom: '1rem', color: '#007bff' }}>참석자 ({filteredAttendees.length})</h2>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            height: '32px',
                            position: 'relative',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="이름/기수 검색"
                            value={searchParti}
                            onChange={(e) => setSearchParti(e.target.value)}
                            style={{
                                padding: '0.3rem',
                                fontSize: '0.9rem',
                                width: '120px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                        <div style={{ position: 'absolute', right: 0 }}>
                            <button
                                onClick={handleRemoveSelected}
                                disabled={selectedAttendeeIds.length === 0}
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.9rem',
                                    backgroundColor: selectedAttendeeIds.length === 0 ? '#6c757d' : '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: selectedAttendeeIds.length === 0 ? 'not-allowed' : 'pointer',
                                    opacity: selectedAttendeeIds.length === 0 ? 0.65 : 1,
                                }}
                            >
                                선택 제외 ({selectedAttendeeIds.length})
                            </button>
                        </div>
                    </div>
                    <Table
                        columns={[
                            {
                                header: (
                                    <input
                                        type="checkbox"
                                        checked={isAllAttendeesSelected}
                                        onChange={handleSelectAllAttendees}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                ),
                                accessor: 'id',
                                width: 50,
                                render: (row: Participant) => (
                                    <input
                                        type="checkbox"
                                        checked={selectedAttendeeIds.includes(row.id)}
                                        onChange={() => handleSelectAttendeeRow(row.id)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                ),
                            },
                            { header: '이름', accessor: 'name', width: 100 },
                            { header: '기수', accessor: 'season', width: 80 },
                        ]}
                        data={filteredAttendees}
                        containerStyle={{ width: '100%' }}
                    />
                </div>

                {/* 오른쪽: 미참석자 목록 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ marginBottom: '1rem', color: '#6c757d' }}>미참석자 ({filteredNonAttendees.length})</h2>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center', // Center the input
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            height: '32px',
                            position: 'relative', // Enable absolute positioning for children
                        }}
                    >
                        <input
                            type="text"
                            placeholder="이름/기수 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.3rem',
                                fontSize: '0.9rem',
                                width: '120px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                        <div style={{ position: 'absolute', right: 0 }}>
                            <button
                                onClick={handleAddSelected}
                                disabled={selectedNonAttendeeIds.length === 0}
                                style={{
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.9rem',
                                    backgroundColor: selectedNonAttendeeIds.length === 0 ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: selectedNonAttendeeIds.length === 0 ? 'not-allowed' : 'pointer',
                                    opacity: selectedNonAttendeeIds.length === 0 ? 0.65 : 1,
                                }}
                            >
                                선택 추가 ({selectedNonAttendeeIds.length})
                            </button>
                        </div>
                    </div>
                    <Table
                        columns={[
                            {
                                header: (
                                    <input
                                        type="checkbox"
                                        checked={isAllNonAttendeesSelected}
                                        onChange={handleSelectAllNonAttendees}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                ),
                                accessor: 'id',
                                width: 50,
                                render: (row: Participant) => (
                                    <input
                                        type="checkbox"
                                        checked={selectedNonAttendeeIds.includes(row.id)}
                                        onChange={() => handleSelectNonAttendeeRow(row.id)}
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                ),
                            },
                            { header: '이름', accessor: 'name', width: 100 },
                            { header: '기수', accessor: 'season', width: 80 },
                        ]}
                        data={filteredNonAttendees}
                        containerStyle={{ width: '100%' }}
                    />
                </div>
            </div>
        </main>
    );
}

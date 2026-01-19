import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../components/ui/Table';
import { ParticipantService, type Meeting, type Participant } from '../services/participantService';
import { meetingService } from '../services/meetingService';
import '../app/App.css';

export default function ListPage() {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoding] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [meetingName, setMeetingName] = useState('');

    // 모달 핸들러
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMeetingName('');
    };

    const handleCreateMeeting = async () => {
        if (!meetingName.trim()) {
            alert('모임 이름을 입력해주세요.');
            return;
        }

        if (selectedIds.length === 0) {
            alert('참여자를 선택해주세요.');
            return;
        }

        try {
            const newMeeting = await meetingService.create({
                title: meetingName,
                desc: '환영합니다.', // 기본값
                date: new Date().toISOString(), // 현재 시간
                location: '서울', // 기본값
                participantIds: selectedIds,
            });

            alert(`'${meetingName}' 모임이 생성되었습니다!`);
            navigate(`/meetingDtl/${newMeeting.id}`, { state: { isNew: true } });
            handleCloseModal();
            setSelectedIds([]); // 선택 초기화
        } catch (error) {
            console.error('Failed to create meeting:', error);
            alert('모임 생성에 실패했습니다.');
        }
    };

    const formtDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // 서버에서 데이터 불러오기
    const loadData = async () => {
        try {
            setLoding(true);
            setError(null);
            const participant = await ParticipantService.getAll();
            const meetingList = await meetingService.getAll();
            setParticipants(participant);
            setMeetings(meetingList);
        } catch (err) {
            console.error('Failed to load participants:', err);
            setError('참여자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoding(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 선택한 참여자 삭제
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 참여자를 선택해주세요.');
            return;
        }

        if (window.confirm(`선택한 ${selectedIds.length}명을 삭제하시겠습니까?`)) {
            try {
                await Promise.all(selectedIds.map((id) => ParticipantService.delete(id)));
                setSelectedIds([]);
                await loadData(); // 목록 새로고침
                alert('삭제 되었습니다.');
            } catch (err) {
                console.error('Failed to delete participants:', err);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    // 선택한 모임 삭제
    const handleDeleteSelectedMeetings = async () => {
        if (selectedMeetingIds.length === 0) {
            alert('삭제할 모임을 선택해주세요.');
            return;
        }

        if (window.confirm(`선택한 ${selectedMeetingIds.length}개의 모임을 삭제하시겠습니까?`)) {
            try {
                await Promise.all(selectedMeetingIds.map((id) => meetingService.delete(id)));
                setSelectedMeetingIds([]);
                await loadData(); // 목록 새로고침
                alert('삭제 되었습니다.');
            } catch (err) {
                console.error('Failed to delete meetings:', err);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedMeetingIds, setSelectedMeetingIds] = useState<string[]>([]); // 모임 선택 상태 추가
    const [searchTerm, setSearchTerm] = useState('');

    // 검색 필터링 (이름 또는 기수)
    const filteredParticipants = participants.filter((p) => {
        const lowerTerm = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(lowerTerm) || p.season.toLowerCase().includes(lowerTerm);
    });

    const isAllSelected = filteredParticipants.length > 0 && selectedIds.length === filteredParticipants.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredParticipants.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // 모임 선택 로직
    const isAllMeetingsSelected = meetings.length > 0 && selectedMeetingIds.length === meetings.length;

    const handleSelectAllMeetings = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedMeetingIds(meetings.map((m) => m.id));
        } else {
            setSelectedMeetingIds([]);
        }
    };

    const handleSelectMeetingRow = (id: string) => {
        if (selectedMeetingIds.includes(id)) {
            setSelectedMeetingIds(selectedMeetingIds.filter((sid) => sid !== id));
        } else {
            setSelectedMeetingIds([...selectedMeetingIds, id]);
        }
    };

    // 컬럼 정의 (체크박스 사이즈 확대)
    const columns = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
            ),
            accessor: 'id' as keyof Participant,
            width: 50,
            render: (row: Participant) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
            ),
        },
        {
            header: '프로필',
            accessor: 'profile' as keyof Participant,
            width: 80,
            render: (row: Participant) =>
                row.profile?.imageUrl ? (
                    <img
                        src={row.profile.imageUrl}
                        alt={row.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <span>-</span>
                ),
        },
        {
            header: '이름',
            accessor: 'name' as keyof Participant,
            width: 100,
            render: (row: Participant) => (
                <span
                    onClick={() => navigate(`/dtl/${row.id}`)}
                    style={{
                        cursor: 'pointer',
                        color: '#007bff',
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                    }}
                >
                    {row.name}
                </span>
            ),
        },
        { header: '기수', accessor: 'season' as keyof Participant, width: 100 },
        { header: '연락처', accessor: 'phone' as keyof Participant, width: 100 },
    ];

    const meetingColumns = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={isAllMeetingsSelected}
                    onChange={handleSelectAllMeetings}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
            ),
            accessor: 'id' as keyof Meeting,
            width: 50,
            render: (row: Meeting) => (
                <input
                    type="checkbox"
                    checked={selectedMeetingIds.includes(row.id)}
                    onChange={() => handleSelectMeetingRow(row.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
            ),
        },
        {
            header: '모임명',
            accessor: 'title' as keyof Meeting,
            width: 80,
            render: (row: Meeting) => (
                <span
                    onClick={() => navigate(`/meetingDtl/${row.id}`)}
                    style={{
                        cursor: 'pointer',
                        color: '#007bff',
                        textDecoration: 'underline',
                        fontWeight: 'bold',
                    }}
                >
                    {row.title}
                </span>
            ),
        },
        {
            header: '생성일',
            accessor: 'createdAt' as keyof Meeting,
            width: 80,
            render: (row: Meeting) => formtDate(row.createdAt),
        },
        {
            header: '수정일',
            accessor: 'updatedAt' as keyof Meeting,
            width: 80,
            render: (row: Meeting) => formtDate(row.updatedAt),
        },
    ];

    // 로딩 중
    if (loading) {
        return (
            <div className="app">
                <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                    <p>로딩 중...</p>
                </main>
            </div>
        );
    }

    // 에러 발생
    if (error) {
        return (
            <div className="app">
                <main className="main-content" style={{ justifyContent: 'center', paddingTop: '4rem' }}>
                    <p style={{ color: 'red' }}>{error}</p>
                    <button onClick={loadData} style={{ marginTop: '1rem' }}>
                        다시 시도
                    </button>
                </main>
            </div>
        );
    }

    // 선택된 참여자 목록
    const selectedParticipants = participants.filter((p) => selectedIds.includes(p.id));

    return (
        <main className="main-content" style={{ justifyContent: 'flex-start', gap: '4rem' }}>
            {/* 상단: 참여자 목록 영역 */}
            <section
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>참여자 목록</h1>

                <div
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                        maxWidth: '800px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                    }}
                >
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            style={{ backgroundColor: '#ffc107', color: 'black', borderColor: '#ffc107' }}
                        >
                            선택 삭제 ({selectedIds.length})
                        </button>
                    )}
                    <button onClick={() => navigate('/add')}>참여자 등록</button>
                    <button onClick={handleOpenModal}>모임 등록</button>
                </div>

                <div
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                        maxWidth: '800px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <input
                        type="text"
                        placeholder="이름 또는 기수로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '60%',
                            padding: '0.8rem',
                            fontSize: '1rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            boxSizing: 'border-box',
                        }}
                    />
                    <button
                        style={{
                            padding: '0.8rem 1.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        검색
                    </button>
                </div>

                {participants.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>등록된 참여자가 없습니다.</p>
                        <button onClick={() => navigate('/add')} style={{ marginTop: '1rem' }}>
                            첫 참여자 등록하기
                        </button>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={filteredParticipants}
                        containerStyle={{
                            width: '90%',
                            maxWidth: '800px',
                        }}
                    />
                )}

                {/* 모달 UI */}
                {isModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '8px',
                                width: '90%',
                                maxWidth: '400px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>모임 등록</h2>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label
                                    htmlFor="meetingName"
                                    style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: 'bold',
                                        color: '#555',
                                    }}
                                >
                                    모임 이름
                                </label>
                                <input
                                    id="meetingName"
                                    type="text"
                                    value={meetingName}
                                    onChange={(e) => setMeetingName(e.target.value)}
                                    placeholder="모임 이름을 입력하세요"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        fontSize: '1rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            {/* 선택된 참여자 표시 */}
                            {selectedParticipants.length > 0 && (
                                <div
                                    style={{
                                        marginBottom: '1.5rem',
                                        backgroundColor: '#f8f9fa',
                                        padding: '1rem',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', marginTop: 0 }}>
                                        선택 참여자 ({selectedParticipants.length})
                                    </p>
                                    <ul
                                        style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            margin: 0,
                                            maxHeight: '100px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {selectedParticipants.map((p) => (
                                            <li key={p.id} style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                                {p.name} ({p.season})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        backgroundColor: '#6c757d',
                                        borderColor: '#6c757d',
                                        color: 'white',
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleCreateMeeting}
                                    style={{
                                        backgroundColor: '#007bff',
                                        borderColor: '#007bff',
                                        color: 'white',
                                    }}
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* 하단: 모임 목록 영역 */}
            <section
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>모임 목록</h1>

                {/* 모임 선택 삭제 버튼 영역 */}
                <div
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                        maxWidth: '800px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                    }}
                >
                    {selectedMeetingIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelectedMeetings}
                            style={{ backgroundColor: '#ffc107', color: 'black', borderColor: '#ffc107' }}
                        >
                            선택 삭제 ({selectedMeetingIds.length})
                        </button>
                    )}
                </div>

                {meetings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>등록된 모임이 없습니다.</p>
                        <button onClick={handleOpenModal} style={{ marginTop: '1rem' }}>
                            모임 만들기
                        </button>
                    </div>
                ) : (
                    <Table
                        columns={meetingColumns}
                        data={meetings}
                        containerStyle={{
                            width: '90%',
                            maxWidth: '800px',
                        }}
                    />
                )}
            </section>
        </main>
    );
}

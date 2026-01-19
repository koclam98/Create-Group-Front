import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../components/ui/Table';
import { ParticipantService, type Meeting, type Participant } from '../services/participantService';
import { meetingService } from '../services/meetingService';
import '../app/App.css';
import '../styles/common.css';

const DEFAULT_MEETING_DESC = '환영합니다.';
const DEFAULT_LOCATION = '서울';

export default function ListPage() {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [meetingName, setMeetingName] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedMeetingIds, setSelectedMeetingIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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
                desc: DEFAULT_MEETING_DESC,
                date: new Date().toISOString(),
                location: DEFAULT_LOCATION,
                participantIds: selectedIds,
            });

            alert(`'${meetingName}' 모임이 생성되었습니다!`);
            navigate(`/meetingDtl/${newMeeting.id}`, { state: { isNew: true } });
            handleCloseModal();
            setSelectedIds([]);
        } catch (error) {
            console.error('Failed to create meeting:', error);
            alert('모임 생성에 실패했습니다.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const participant = await ParticipantService.getAll();
            const meetingList = await meetingService.getAll();
            setParticipants(participant);
            setMeetings(meetingList);
        } catch (err) {
            console.error('Failed to load participants:', err);
            setError('참여자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert('삭제할 참여자를 선택해주세요.');
            return;
        }

        if (window.confirm(`선택한 ${selectedIds.length}명을 삭제하시겠습니까?`)) {
            try {
                await Promise.all(selectedIds.map((id) => ParticipantService.delete(id)));
                setSelectedIds([]);
                await loadData();
                alert('삭제 되었습니다.');
            } catch (err) {
                console.error('Failed to delete participants:', err);
                alert('삭제에 실패했습니다.');
            }
        }
    };

    const handleDeleteSelectedMeetings = async () => {
        if (selectedMeetingIds.length === 0) {
            alert('삭제할 모임을 선택해주세요.');
            return;
        }

        if (window.confirm(`선택한 ${selectedMeetingIds.length}개의 모임을 삭제하시겠습니까?`)) {
            try {
                await Promise.all(selectedMeetingIds.map((id) => meetingService.delete(id)));
                setSelectedMeetingIds([]);
                await loadData();
                alert('삭제 되었습니다.');
            } catch (err) {
                console.error('Failed to delete meetings:', err);
                alert('삭제에 실패했습니다.');
            }
        }
    };

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

    const columns = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="checkbox-large"
                />
            ),
            accessor: 'id' as keyof Participant,
            width: 50,
            render: (row: Participant) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="checkbox-large"
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
                        className="profile-image-small"
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
                    className="link-primary"
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
                    className="checkbox-large"
                />
            ),
            accessor: 'id' as keyof Meeting,
            width: 50,
            render: (row: Meeting) => (
                <input
                    type="checkbox"
                    checked={selectedMeetingIds.includes(row.id)}
                    onChange={() => handleSelectMeetingRow(row.id)}
                    className="checkbox-large"
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
                    className="link-primary"
                >
                    {row.title}
                </span>
            ),
        },
        {
            header: '생성일',
            accessor: 'createdAt' as keyof Meeting,
            width: 80,
            render: (row: Meeting) => formatDate(row.createdAt),
        },
        {
            header: '수정일',
            accessor: 'updatedAt' as keyof Meeting,
            width: 80,
            render: (row: Meeting) => formatDate(row.updatedAt),
        },
    ];

    if (loading) {
        return (
            <div className="app">
                <main className="main-content loading-container">
                    <p>로딩 중...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app">
                <main className="main-content loading-container">
                    <p className="error-text">{error}</p>
                    <button onClick={loadData} className="mt-1">
                        다시 시도
                    </button>
                </main>
            </div>
        );
    }

    const selectedParticipants = participants.filter((p) => selectedIds.includes(p.id));

    return (
        <main className="main-content justify-start gap-4">
            <section className="section-container">
                <h1 className="section-header">참여자 목록</h1>

                <div className="section-actions">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="button-warning"
                        >
                            선택 삭제 ({selectedIds.length})
                        </button>
                    )}
                    <button onClick={() => navigate('/add')}>참여자 등록</button>
                    <button onClick={handleOpenModal}>모임 등록</button>
                </div>

                <div className="section-search">
                    <input
                        type="text"
                        placeholder="이름 또는 기수로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input-large"
                    />
                    <button className="button-primary">
                        검색
                    </button>
                </div>

                {participants.length === 0 ? (
                    <div className="content-centered">
                        <p>등록된 참여자가 없습니다.</p>
                        <button onClick={() => navigate('/add')} className="mt-1">
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

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 className="modal-header">모임 등록</h2>

                            <div className="modal-input-wrapper">
                                <label htmlFor="meetingName" className="form-label-centered">
                                    모임 이름
                                </label>
                                <input
                                    id="meetingName"
                                    type="text"
                                    value={meetingName}
                                    onChange={(e) => setMeetingName(e.target.value)}
                                    placeholder="모임 이름을 입력하세요"
                                    className="form-input-large"
                                />
                            </div>

                            {selectedParticipants.length > 0 && (
                                <div className="modal-selected-list">
                                    <p className="modal-selected-title">
                                        선택 참여자 ({selectedParticipants.length})
                                    </p>
                                    <ul className="modal-participant-list">
                                        {selectedParticipants.map((p) => (
                                            <li key={p.id} className="modal-participant-item">
                                                {p.name} ({p.season})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="modal-actions">
                                <button
                                    onClick={handleCloseModal}
                                    className="button-secondary"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleCreateMeeting}
                                    className="button-primary"
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="section-container">
                <h1 className="section-header">모임 목록</h1>

                <div className="section-actions">
                    {selectedMeetingIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelectedMeetings}
                            className="button-warning"
                        >
                            선택 삭제 ({selectedMeetingIds.length})
                        </button>
                    )}
                </div>

                {meetings.length === 0 ? (
                    <div className="content-centered">
                        <p>등록된 모임이 없습니다.</p>
                        <button onClick={handleOpenModal} className="mt-1">
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

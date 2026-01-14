import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table } from '../components/ui/Table';
import { getParticipants, clearParticipants, type CastMember } from '../utils/storage';
import '../app/App.css';

export default function ListPage() {
    const navigate = useNavigate();
    const [castMembers, setCastMembers] = useState<CastMember[]>([]);

    const loadData = () => {
        setCastMembers(getParticipants());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleClearData = () => {
        console.log('Clear button clicked'); // Debugging
        if (window.confirm('정말 모든 데이터를 삭제하시겠습니까?')) {
            clearParticipants();
            setCastMembers([]); // Update UI immediately
            console.log('Data cleared'); // Debugging
            alert('초기화되었습니다.');
        }
    };

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(castMembers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = castMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(castMembers.map((m) => m.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const isAllSelected = castMembers.length > 0 && selectedIds.length === castMembers.length;

    // Define columns
    const columns = [
        {
            header: <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />,
            accessor: 'id' as keyof CastMember,
            width: 50,
            render: (row: CastMember) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                />
            ),
        },
        {
            header: '프로필',
            accessor: 'profileImage' as keyof CastMember,
            width: 80,
            render: (row: CastMember) =>
                row.profileImage ? (
                    <img
                        src={row.profileImage}
                        alt={row.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <span>-</span>
                ),
        },
        { header: '이름', accessor: 'name' as keyof CastMember, width: 100 },
        { header: '기수', accessor: 'season' as keyof CastMember, width: 100 },
        { header: '연락처', accessor: 'phone' as keyof CastMember, width: 100 },
    ];

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="app">
            <main className="main-content" style={{ justifyContent: 'flex-start', paddingTop: '4rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>참여자 목록</h1>

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
                    <button
                        onClick={handleClearData}
                        style={{ backgroundColor: '#dc3545', color: 'white', borderColor: '#dc3545' }}
                    >
                        초기화
                    </button>
                    <button onClick={() => navigate('/add')}>참여자 등록</button>
                    <Link to="/">
                        <button>홈으로 돌아가기</button>
                    </Link>
                </div>

                <div style={{ width: '100%', maxWidth: '800px' }}>
                    <Table columns={columns} data={currentData} />

                    <div
                        style={{
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            alignItems: 'center',
                        }}
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            이전
                        </button>
                        <span>
                            {currentPage} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            다음
                        </button>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>Copyright © 2024 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
}

import React from 'react';
import './Table.css';

interface Column<T> {
    header: React.ReactNode;
    accessor: keyof T;
    width?: number | string;
    render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    containerStyle?: React.CSSProperties;
}

export function Table<T>({ columns, data, containerStyle }: TableProps<T>) {
    return (
        <div className="table-wrapper" style={containerStyle}>
            <div className="table-header">
                <table className="custom-table">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} style={{ width: col.width }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="table-body">
                <table className="custom-table">
                    <tbody>
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} style={{ width: col.width }}>
                                        {col.render ? col.render(row) : String(row[col.accessor])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

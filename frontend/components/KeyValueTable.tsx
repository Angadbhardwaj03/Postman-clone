"use client";
import React from 'react';
import './KeyValueTable.css';

export interface KeyValue {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

export default function KeyValueTable({
    items,
    setItems,
}: {
    items: KeyValue[];
    setItems: React.Dispatch<React.SetStateAction<KeyValue[]>>;
}) {
    const handleChange = (id: string, field: keyof KeyValue, val: string | boolean) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
        );
    };

    const addRow = () => {
        setItems((prev) => [
            ...prev,
            { id: Math.random().toString(36).substr(2, 9), key: '', value: '', enabled: true },
        ]);
    };

    const deleteRow = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="kv-table-container">
            <table className="kv-table">
                <thead>
                    <tr>
                        <th style={{ width: '40px', textAlign: 'center' }}></th>
                        <th>Key</th>
                        <th>Value</th>
                        <th style={{ width: '40px', textAlign: 'center' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td style={{ textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={item.enabled}
                                    onChange={(e) => handleChange(item.id, 'enabled', e.target.checked)}
                                />
                            </td>
                            <td>
                                <input
                                    className="kv-input"
                                    placeholder="Key"
                                    value={item.key}
                                    onChange={(e) => handleChange(item.id, 'key', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    className="kv-input"
                                    placeholder="Value"
                                    value={item.value}
                                    onChange={(e) => handleChange(item.id, 'value', e.target.value)}
                                />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                <button className="del-btn" onClick={() => deleteRow(item.id)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="add-btn" onClick={addRow}>+ Add Row</button>
        </div>
    );
}

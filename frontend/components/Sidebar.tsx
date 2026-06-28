"use client";
import React, { useState, useEffect } from 'react';

export default function Sidebar() {
    const [activeTab, setActiveTab] = useState('collections');
    const [history, setHistory] = useState<Array<{ id: string | number; method: string; url: string }>>([]);
    const [collections, setCollections] = useState<Array<{ id: string | number; name: string }>>([]);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        fetch(`${apiUrl}/history`).then(r => r.json()).then(setHistory).catch(console.error);
        fetch(`${apiUrl}/collections`).then(r => r.json()).then(setCollections).catch(console.error);
    }, [activeTab]);

    return (
        <aside className="sidebar">
            <div className="sidebar-tabs">
                <button
                    className={`tab-btn ${activeTab === 'collections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collections')}
                >
                    Collections
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>
            <div className="sidebar-content">
                {activeTab === 'collections' ? (
                    <div>
                        {collections.map(c => (
                            <div key={c.id} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                                📁 {c.name}
                            </div>
                        ))}
                        {collections.length === 0 && <div className="placeholder">No Collections</div>}
                    </div>
                ) : (
                    <div>
                        {history.map(h => (
                            <div key={h.id} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '12px', display: 'flex', flexWrap: 'wrap', wordBreak: 'break-all' }}>
                                <span style={{ fontWeight: 'bold', color: `var(--color-${h.method.toLowerCase()})`, marginRight: '10px' }}>{h.method}</span>
                                <span style={{ color: 'var(--text-primary)' }}>{h.url}</span>
                            </div>
                        ))}
                        {history.length === 0 && <div className="placeholder">No History</div>}
                    </div>
                )}
            </div>
        </aside>
    );
}

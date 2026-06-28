"use client";
import React, { useState } from 'react';
import './ResponseViewer.css';

export type ResponsePayload =
    | { error: string; status?: never; time?: never; size?: never; headers?: never; data?: never; }
    | { error?: never; status: number; time: number; size: number; headers: Record<string, string>; data: unknown; };

export default function ResponseViewer({ response, loading }: { response: ResponsePayload | null; loading: boolean }) {
    const [activeTab, setActiveTab] = useState('Body');

    if (loading) {
        return <div className="response-container empty">Sending request...</div>;
    }

    if (!response) {
        return <div className="response-container empty">Enter the URL and click Send to get a response</div>;
    }

    if (response.error) {
        return <div className="response-container error">Error: {response.error}</div>;
    }

    const { status = 0, time = 0, size = 0, headers = {} as Record<string, string>, data = null } = response;

    let statusColor = "var(--color-get)";
    if (status >= 400 && status < 500) statusColor = "var(--color-post)";
    if (status >= 500) statusColor = "var(--color-delete)";

    return (
        <div className="response-container">
            <div className="res-header">
                <div className="res-tabs">
                    {['Body', 'Headers'].map(tab => (
                        <button
                            key={tab}
                            className={`res-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="res-stats">
                    <span style={{ color: statusColor }}>Status: {status}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Time: <span style={{ color: 'var(--text-primary)' }}>{time} ms</span></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Size: <span style={{ color: 'var(--text-primary)' }}>{size} B</span></span>
                </div>
            </div>

            <div className="res-content">
                {activeTab === 'Body' && (
                    <pre className="res-body">{typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data ?? '')}</pre>
                )}
                {activeTab === 'Headers' && (
                    <table className="res-headers-table">
                        <tbody>
                            {Object.entries(headers).map(([k, v]) => (
                                <tr key={k}>
                                    <td className="res-header-key">{k}</td>
                                    <td className="res-header-val">{v as string}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

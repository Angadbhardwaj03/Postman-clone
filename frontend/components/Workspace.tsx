"use client";
import React, { useState } from 'react';
import RequestBuilder, { RequestPayload } from './RequestBuilder';
import ResponseViewer, { ResponsePayload } from './ResponseViewer';

interface WorkspaceEnvironment {
    name?: string;
    variables?: Array<{ key: string; value: string }>;
}

export default function Workspace({ activeEnvironment }: { activeEnvironment: WorkspaceEnvironment | null }) {
    const [response, setResponse] = useState<ResponsePayload | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSendRequest = async (requestData: RequestPayload) => {
        setLoading(true);
        setResponse(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/proxy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const data = await res.json();
            setResponse(data);
        } catch (err) {
            console.error(err);
            setResponse({ error: String(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="workspace">
            <div className="workspace-header">
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Untitled Request {activeEnvironment ? `(${activeEnvironment.name})` : ''}
                </div>
            </div>
            <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: '1', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                    <RequestBuilder onSend={handleSendRequest} loading={loading} activeEnvironment={activeEnvironment} />
                </div>
                <div style={{ height: '3px', backgroundColor: 'var(--border-color)', margin: '10px 0', cursor: 'row-resize', flexShrink: 0 }}></div>
                <div style={{ flex: '1', minHeight: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <ResponseViewer response={response} loading={loading} />
                </div>
            </div>
        </main>
    );
}

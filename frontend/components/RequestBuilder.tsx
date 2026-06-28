"use client";
import React, { useState } from 'react';
import KeyValueTable, { KeyValue } from './KeyValueTable';
import './RequestBuilder.css';

export interface RequestPayload {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string | null;
}
export interface EnvironmentPayload {
    variables?: Array<{ key: string; value: string }>;
}

export default function RequestBuilder({ onSend, loading, activeEnvironment }: { onSend: (data: RequestPayload) => void; loading?: boolean; activeEnvironment: EnvironmentPayload | null }) {
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState('https://httpbin.org/get');
    const [activeTab, setActiveTab] = useState('Params');

    const [params, setParams] = useState<KeyValue[]>([
        { id: '1', key: '', value: '', enabled: true }
    ]);

    const [headers, setHeaders] = useState<KeyValue[]>([
        { id: '1', key: 'Accept', value: '*/*', enabled: true }
    ]);

    const [bodyType, setBodyType] = useState('none');
    const [bodyContent, setBodyContent] = useState('');

    const replaceVars = (str: string) => {
        if (!str || !activeEnvironment || !activeEnvironment.variables) return str;
        let newStr = str;
        activeEnvironment.variables.forEach((v: { key: string; value: string }) => {
            newStr = newStr.replace(new RegExp(`{{${v.key}}}`, 'g'), v.value);
        });
        return newStr;
    };

    const handleSend = () => {
        const reqHeaders: Record<string, string> = {};
        headers.forEach(h => {
            if (h.enabled && h.key) reqHeaders[replaceVars(h.key)] = replaceVars(h.value);
        });

        let finalUrl = replaceVars(url);
        const qParams = params.filter(p => p.enabled && p.key);
        if (qParams.length > 0) {
            try {
                const urlObj = new URL(finalUrl);
                qParams.forEach(p => urlObj.searchParams.append(replaceVars(p.key), replaceVars(p.value)));
                finalUrl = urlObj.toString();
            } catch (e) {
                console.error(e);
            }
        }

        onSend({
            method,
            url: finalUrl,
            headers: reqHeaders,
            body: bodyType === 'raw' ? replaceVars(bodyContent) : null
        });
    };

    return (
        <div className="req-builder">
            <div className="req-url-bar">
                <select
                    className="method-select"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{ color: `var(--color-${method.toLowerCase()})` }}
                >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>PATCH</option>
                    <option>DELETE</option>
                    <option>OPTIONS</option>
                </select>
                <input
                    className="url-input"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter request URL"
                />
                <button className="send-btn" onClick={handleSend} disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>

            <div className="req-tabs">
                {['Params', 'Headers', 'Body'].map(tab => (
                    <button
                        key={tab}
                        className={`req-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="req-tab-content">
                {activeTab === 'Params' && (
                    <div>
                        <h4 style={{ marginBottom: '10px', color: 'var(--text-secondary)' }}>Query Parameters</h4>
                        <KeyValueTable items={params} setItems={setParams} />
                    </div>
                )}
                {activeTab === 'Headers' && (
                    <div>
                        <h4 style={{ marginBottom: '10px', color: 'var(--text-secondary)' }}>Headers</h4>
                        <KeyValueTable items={headers} setItems={setHeaders} />
                    </div>
                )}
                {activeTab === 'Body' && (
                    <div>
                        <div className="body-types">
                            {['none', 'form-data', 'x-www-form-urlencoded', 'raw'].map(type => (
                                <label key={type} style={{ marginRight: '15px', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="bodyType"
                                        value={type}
                                        checked={bodyType === type}
                                        onChange={(e) => setBodyType(e.target.value)}
                                        style={{ marginRight: '5px' }}
                                    /> {type}
                                </label>
                            ))}
                        </div>
                        {bodyType === 'raw' && (
                            <textarea
                                className="body-textarea"
                                value={bodyContent}
                                onChange={(e) => setBodyContent(e.target.value)}
                                placeholder="Enter JSON/text here"
                            />
                        )}
                        {bodyType !== 'none' && bodyType !== 'raw' && (
                            <div className="placeholder">Table editor for {bodyType} (Coming Soon)</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

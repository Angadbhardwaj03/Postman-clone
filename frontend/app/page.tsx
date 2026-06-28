"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Workspace from '@/components/Workspace';
import './globals.css';

interface Environment { id: string | number; name: string; }

export default function Home() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnvId, setSelectedEnvId] = useState<string>('');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/environments`)
      .then(r => r.json())
      .then(data => {
        setEnvironments(data);
        if (data.length > 0) setSelectedEnvId(data[0].id.toString());
      })
      .catch(console.error);
  }, []);

  const currentEnv = environments.find(e => e.id.toString() === selectedEnvId);

  return (
    <div className="app-container">
      <header className="top-header">
        <div style={{ fontWeight: 600, color: 'var(--accent-color)' }}>Postman Clone</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={selectedEnvId}
            onChange={e => setSelectedEnvId(e.target.value)}
            style={{ backgroundColor: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">No Environment</option>
            {environments.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
      </header>
      <div className="main-content">
        <Sidebar />
        <Workspace activeEnvironment={currentEnv ?? null} />
      </div>
    </div>
  );
}

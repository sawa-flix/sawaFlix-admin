"use client";
import React, { useState } from 'react';

interface UploadResult {
    success?: boolean;
    data?: unknown;
    error?: string;
    details?: string;
}

export default function TestStoriesUploadPage() {
    const [contentType, setContentType] = useState('video');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<UploadResult | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData(e.currentTarget);
            const response = await fetch('/api/content/stories/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setResult({
                error: 'Fetch failed',
                details: err instanceof Error ? err.message : String(err)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'system-ui', color: '#f8fafc' }}>
            <h1 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>📖 Upload Story</h1>
            <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Test the <code>/api/content/stories/upload</code> endpoint</p>

            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#151c25', padding: '1.5rem', borderRadius: '12px', border: '1px solid #2d3748' }}
            >
                <div style={fieldStyle}>
                    <label style={labelStyle}>Story Title:</label>
                    <input type="text" name="title" required style={inputStyle} placeholder="A Brave Legend" />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Community Group:</label>
                    <input type="text" name="community_group" required style={inputStyle} placeholder="e.g. Northern Tribes" />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Story Type:</label>
                    <select
                        name="content_type"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="video">Video Story</option>
                        <option value="audio">Audio Story</option>
                        <option value="text">Written Story</option>
                    </select>
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Languages (comma separated):</label>
                    <input type="text" name="languages" required style={inputStyle} placeholder="Kom, Nso, English, French" />
                </div>

                {contentType !== 'text' ? (
                    <div style={fieldStyle}>
                        <label style={labelStyle}>{contentType === 'video' ? 'Video File' : 'Audio File'}:</label>
                        <input
                            type="file"
                            name="media"
                            required
                            accept={contentType === 'video' ? "video/*" : "audio/*"}
                            style={{ ...inputStyle, padding: '0.4rem' }}
                        />
                    </div>
                ) : (
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Story Text:</label>
                        <textarea name="content_text" required style={{ ...inputStyle, height: '150px' }} placeholder="Write the story here..." />
                    </div>
                )}

                <div style={fieldStyle}>
                    <label style={labelStyle}>Cover Photo (Optional):</label>
                    <input type="file" name="cover" accept="image/*" style={{ ...inputStyle, padding: '0.4rem' }} />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Duration in seconds (Optional):</label>
                    <input type="number" name="duration" style={inputStyle} placeholder="e.g. 120" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Uploading...' : 'Upload Story'}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: result.error ? '#ff4d4d' : '#10b981' }}>
                        {result.error ? '❌ Upload Failed' : '✅ Upload Successful'}
                    </h3>
                    <pre style={{
                        padding: '1rem',
                        background: '#0b0e14',
                        color: '#10b981',
                        borderRadius: '8px',
                        overflowX: 'auto',
                        border: '1px solid #2d3748',
                        fontSize: '0.85rem'
                    }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' };
const labelStyle = { fontWeight: '600' as const, fontSize: '0.85rem', color: '#94a3b8' };
const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #2d3748',
    borderRadius: '6px',
    background: '#1f2937',
    color: 'white',
    outline: 'none'
};
const buttonStyle = {
    padding: '0.8rem',
    background: '#7c3aed',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold' as const,
    transition: 'background 0.2s',
};

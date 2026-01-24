import { FileText, CheckCircle2, AlertCircle, Plus, ExternalLink, Download, Shield } from 'lucide-react';

export default function LegalVault({ team }) {
    const documents = [
        { name: 'FAST Agreement', status: 'Signed', date: 'Jan 15, 2026', signers: ['Louis L.', 'Sarah K.'], type: 'agreement' },
        { name: 'IP Assignment Deed', status: 'Signed', date: 'Jan 15, 2026', signers: ['Louis L.', 'Sarah K.'], type: 'assignment' },
        { name: '83(b) Election', status: 'Pending', date: null, signers: [], type: 'tax' },
        { name: 'Operating Agreement', status: 'Draft', date: null, signers: [], type: 'agreement' }
    ];

    return (
        <div className="saas-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Legal Vault
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Securely store and track all your startup's essential legal documents.
                    </p>
                </div>
                <button className="btn-primary">
                    <Plus size={16} />
                    Upload Document
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {documents.map((doc, i) => (
                    <div key={i} className="saas-panel hover-glass" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={24} color="var(--accent-primary)" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{doc.name}</h3>
                                        <span style={{
                                            background: doc.status === 'Signed' ? 'rgba(16, 185, 129, 0.1)' : doc.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                            color: doc.status === 'Signed' ? '#10B981' : doc.status === 'Pending' ? '#F59E0B' : 'var(--accent-primary)',
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {doc.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {doc.date ? (
                                            <span>Signed on {doc.date}</span>
                                        ) : (
                                            <span>Start drafting to sign</span>
                                        )}
                                        {doc.signers.length > 0 && (
                                            <span>• Signers: {doc.signers.join(', ')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {doc.status === 'Signed' && (
                                    <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                                        <Download size={14} />
                                        Download
                                    </button>
                                )}
                                <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                                    <ExternalLink size={14} />
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Shield size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Encrypted & Secure
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            All documents are encrypted at rest and in transit. Access is strictly limited to verified team members.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

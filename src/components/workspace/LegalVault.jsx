import { FileText, CheckCircle2, AlertCircle, Plus, ExternalLink, Download, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LegalVault({ team }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newDoc, setNewDoc] = useState({ name: '', type: 'agreement' });

    // Fetch documents
    useEffect(() => {
        const fetchDocs = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('legal_documents')
                .select('*')
                .eq('team_id', team.id)
                .order('created_at', { ascending: false });

            if (data) setDocuments(data);
            setLoading(false);
        };

        fetchDocs();

        // Realtime subscription
        const channel = supabase
            .channel('legal-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'legal_documents',
                filter: `team_id=eq.${team.id}`
            }, () => {
                fetchDocs();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [team.id]);

    const handleAddDocument = async (e) => {
        e.preventDefault();
        if (!newDoc.name) return;

        await supabase.from('legal_documents').insert([{
            team_id: team.id,
            name: newDoc.name,
            type: newDoc.type,
            status: 'draft'
        }]);

        // Log activity
        await supabase.from('activity_logs').insert([{
            team_id: team.id,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            action_type: 'legal_doc_added',
            description: `Added legal document: "${newDoc.name}"`
        }]);

        setNewDoc({ name: '', type: 'agreement' });
        setIsAdding(false);
    };

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
                <button className="btn-primary" onClick={() => setIsAdding(true)}>
                    <Plus size={16} />
                    Upload Document
                </button>
            </div>

            {/* Add Document Form */}
            {isAdding && (
                <div className="saas-panel" style={{ padding: '20px', marginBottom: '20px', border: '1px solid var(--accent-primary)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Add Legal Document</h3>
                    <form onSubmit={handleAddDocument}>
                        <input
                            autoFocus
                            className="glass-input"
                            placeholder="Document Name (e.g. FAST Agreement)"
                            value={newDoc.name}
                            onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                            style={{ marginBottom: '12px' }}
                        />
                        <select
                            className="glass-input"
                            value={newDoc.type}
                            onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                            style={{ marginBottom: '12px' }}
                        >
                            <option value="agreement">Agreement</option>
                            <option value="assignment">Assignment</option>
                            <option value="tax">Tax Document</option>
                            <option value="other">Other</option>
                        </select>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Add Document</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                        Loading documents...
                    </div>
                ) : documents.length === 0 && !isAdding ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                        No legal documents yet. Click "Upload Document" to add one.
                    </div>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.id} className="saas-panel hover-glass" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', transition: 'all 0.2s' }}>
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
                                            {doc.signed_date ? (
                                                <span>Signed on {new Date(doc.signed_date).toLocaleDateString()}</span>
                                            ) : (
                                                <span>Start drafting to sign</span>
                                            )}
                                            {doc.signers && doc.signers.length > 0 && (
                                                <span>• Signers: {doc.signers.length} member(s)</span>
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
                    ))
                )}
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

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { FileCheck, Download, AlertTriangle, ArrowLeft, PenTool, CheckCircle, Copy, Printer } from 'lucide-react';
import JSConfetti from 'js-confetti';

export default function AgreementPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agreement, setAgreement] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [error, setError] = useState(null);
    const [signature, setSignature] = useState('');

    useEffect(() => {
        fetchAgreement();
        checkUser();
    }, [id]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchAgreement = async () => {
        try {
            // 1. Fetch Agreement Raw Data
            const { data: agreementData, error: agreementError } = await supabase
                .from('agreements')
                .select('*')
                .eq('id', id)
                .single();

            if (agreementError) throw agreementError;

            // 2. Fetch Profiles for Founders
            const userIds = [agreementData.founder_a_id, agreementData.founder_b_id].filter(Boolean);

            let profilesMap = {};
            if (userIds.length > 0) {
                const { data: profiles, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, name, email') // Assuming email might be in profile or we rely on auth fallback
                    .in('id', userIds);

                if (!profileError && profiles) {
                    profiles.forEach(p => profilesMap[p.id] = p);
                }
            }

            // 3. Attach Profile Data
            const fullAgreement = {
                ...agreementData,
                founder_a: profilesMap[agreementData.founder_a_id] || { name: 'Unknown', email: '' },
                founder_b: profilesMap[agreementData.founder_b_id] || {
                    name: agreementData.content_data?.founderB?.name || 'Waiting for Partner',
                    email: agreementData.founder_b_email || ''
                }
            };

            setAgreement(fullAgreement);
        } catch (err) {
            console.error('Error fetching agreement:', err);
            setError('Agreement not found or access denied.');
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async () => {
        if (!signature.trim()) return alert("Please type your full name to sign.");
        setSigning(true);

        try {
            // Determine who is signing
            const isCreator = user?.id === agreement.founder_a_id;
            // For invitee, we might match by ID or Email if not linked yet
            // If user is logged in and not creator, assume invitee logic for now
            // Ideally we check if user.email matches founder_b_email

            const now = new Date().toISOString();
            const currentSigs = agreement.signatures || {};

            let updates = {};

            if (isCreator) {
                updates = {
                    signatures: { ...currentSigs, a: signature, a_date: now }
                };
            } else {
                // Invitee signing
                updates = {
                    signatures: { ...currentSigs, b: signature, b_date: now },
                    founder_b_id: user?.id || agreement.founder_b_id // Link account if not linked
                };
            }

            // Check if both signed
            const newSigs = updates.signatures;
            let newStatus = agreement.status;
            if (newSigs.a && newSigs.b) {
                newStatus = 'signed_both';
                const jsConfetti = new JSConfetti();
                jsConfetti.addConfetti();
            } else if (newSigs.a || newSigs.b) {
                newStatus = 'signed_partial';
            }

            const { error } = await supabase
                .from('agreements')
                .update({ ...updates, status: newStatus })
                .eq('id', id);

            if (error) throw error;

            await fetchAgreement(); // Refresh
            setSignature('');
        } catch (err) {
            alert('Error signing agreement: ' + err.message);
        } finally {
            setSigning(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // --- GENERATION LOGIC (Reused/Adapted) ---
    // In a real app, this would be a shared utility. For simplicity, we adapt the template here.
    const generateContractText = () => {
        if (!agreement) return '';
        const { content_data, signatures, kill_switch_active, created_at } = agreement;
        const founderA = content_data.founderA;
        const founderB = content_data.founderB;
        const split = content_data.split;
        const config = content_data.config;

        // Signatures
        const signA = signatures?.a;
        const signB = signatures?.b;
        const dateA = signatures?.a_date ? new Date(signatures.a_date).toLocaleDateString() : '__________________';
        const dateB = signatures?.b_date ? new Date(signatures.b_date).toLocaleDateString() : '__________________';

        return `Equity Agreement for Service (EASE)
Version 1.0

${kill_switch_active ? '*** CONDITIONAL PROBATIONARY AGREEMENT ***\n*** SUBJECT TO IMMEDIATE TERMINATION (SECTION 4) ***\n' : ''}
This Equity Agreement for Service (this "Agreement") is entered into as of ${new Date(created_at).toLocaleDateString()} by and between:
1. ${founderA.name} (the "Company/Founder")
2. ${founderB.name} (the "Consultant/Co-Founder")

The parties agree as follows:

1. Services. Consultant agrees to act as a consultant to the Company and provide services to the Company as further described on Exhibit A.

2. Compensation. Calculated based on the contributions detailed in Exhibit A. The Company will take the requisite actions to authorize any equity compensation within 30 days.

3. Expenses. Reimbursed upon prior written approval.

4. Term and Termination. 
${kill_switch_active ? '   \n   **[CRITICAL: 48-HOUR KILL SWITCH ACTIVE]**\n   Notwithstanding standard notice periods, the Company reserves the absolute right to terminate this Agreement immediately (VOIDING ALL EQUITY) if the Consultant fails to deliver the initial "Proof of Work" within 48 hours of the Effective Date.' : '   May be terminated by either party upon five (5) days prior written notice.'}

5. Independent Contractor. Consultant is an independent contractor, not an employee.

6. Intellectual Property. All work product ("Inventions") created by Consultant in connection with the Services shall be the sole property of the Company.

7. Confidentiality. Consultant shall keep all Company information confidential using reasonable measures.

8. Governing Law. Delaware.

-----------------------------------------------------------

SIGNATURE PAGE

Effective Date: ${new Date(created_at).toLocaleDateString()}

COMPANY: ${founderA.name}
Signature: ${signA ? `/s/ ${signA}` : '________________________'}
Date: ${dateA}

CONSULTANT: ${founderB.name}
Signature: ${signB ? `/s/ ${signB}` : '________________________'}
Date: ${dateB}

-----------------------------------------------------------

EXHIBIT A: CoVibr Equity Audit
Date: ${new Date(created_at).toLocaleDateString()}

1. FOUNDER CONTRIBUTIONS
   
   A. ${founderA.name} (${split?.founderA || '??'}%)
      - Role: ${founderA.isCEO ? 'CEO' : 'Co-Founder'}
      - Cash: $${founderA.cash?.toLocaleString()}
      - Sweat: ${founderA.hours} hrs/week
      - Assets: ${founderA.assets?.join(', ') || 'None'}

   B. ${founderB.name} (${split?.founderB || '??'}%)
      - Role: ${founderB.isTechnical ? 'CTO' : 'Co-Founder'}
      - Cash: $${founderB.cash?.toLocaleString()}
      - Sweat: ${founderB.hours} hrs/week
      - Assets: ${founderB.assets?.join(', ') || 'None'}

2. VESTING SCHEDULE
   ${config?.vesting === 'standard' ? 'Standard 4-year vesting with 1-year cliff.' : 'Milestone-based vesting.'}

3. VALUATION CONFIGURATION
   - Methodology: ${config?.slicingPie ? 'Dynamic (Slicing Pie - "Nights & Weekends" Model)' : 'Standard Fixed Split'}
   - CEO Premium: ${config?.ceoPremium}%
   - Technical Premium: ${config?.techPremium}%
   
${kill_switch_active ? '\n4. SPECIAL CONDITIONS\n   **This Agreement is subject to a 48-Hour Probationary Period.**' : ''}
`;
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Agreement...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;

    const isCreator = user?.id === agreement.founder_a_id;
    const isInvitee = !isCreator; // Ideally check email match
    const mySignature = isCreator ? agreement.signatures?.a : agreement.signatures?.b;
    const otherSignature = isCreator ? agreement.signatures?.b : agreement.signatures?.a;
    const statusText = agreement.status === 'signed_both' ? 'Fully Executed' : (mySignature ? 'Waiting for Counterparty' : 'Action Required');

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            {/* Header - Hidden on Print */}
            <div className="no-print" style={{ marginBottom: '32px' }}>
                <button onClick={() => navigate('/equity')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '16px' }}>
                    <ArrowLeft size={16} /> Back to Calculator
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>EASE Agreement</h1>
                            <span className={`tag ${agreement.status === 'signed_both' ? 'tag-green' : 'tag-blur'}`}>
                                {agreement.status === 'signed_both' ? 'COMPLETED' : agreement.status.toUpperCase()}
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Between <strong>{agreement.content_data.founderA.name}</strong> and <strong>{agreement.content_data.founderB.name}</strong>
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-secondary" onClick={handlePrint}>
                            <Printer size={18} style={{ marginRight: '8px' }} /> Print / PDF
                        </button>
                        <button className="btn-ghost" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied! Send this to your co-founder.");
                        }}>
                            <Copy size={18} /> Share Link
                        </button>
                    </div>
                </div>
            </div>

            {/* Contract Viewer / Print Area */}
            <div
                className="saas-panel agreement-paper"
                style={{
                    padding: '60px',
                    background: 'white',
                    color: 'black',
                    marginBottom: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
            >
                <style>{`
                    @media print {
                        @page { margin: 2cm; size: portrait; }
                        body * { visibility: hidden; }
                        .agreement-paper, .agreement-paper * { visibility: visible; }
                        .agreement-paper {
                            position: absolute;
                            left: 0; top: 0; width: 100%;
                            margin: 0; padding: 0;
                            border: none; box-shadow: none;
                        }
                        .no-print { display: none !important; }
                    }
                    .agreement-text {
                        font-family: 'Times New Roman', serif;
                        font-size: 11pt;
                        line-height: 1.5;
                        white-space: pre-wrap;
                    }
                `}</style>

                <div className="agreement-text">
                    {generateContractText()}
                </div>
            </div>

            {/* Signing Section - Hidden on Print */}
            {!mySignature && agreement.status !== 'signed_both' && (
                <div className="saas-panel no-print" style={{ padding: '32px', borderColor: 'var(--accent-primary)', background: 'rgba(99,102,241,0.05)' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '12px', borderRadius: '50%' }}>
                            <PenTool size={24} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                                Sign as {isCreator ? 'Founder (Creator)' : 'Co-Founder (Invitee)'}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                                By signing, you agree to the terms listed above. This action is legally binding within the CoVibr platform.
                            </p>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <input
                                    className="glass-input"
                                    placeholder={`Type "${user?.user_metadata?.full_name || 'Your Name'}" to sign`}
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    style={{ flex: 1, fontFamily: 'Caveat, cursive', fontSize: '1.5rem', color: 'var(--accent-primary)' }}
                                />
                                <button className="btn-primary" onClick={handleSign} disabled={signing}>
                                    {signing ? 'Signing...' : 'Sign Agreement'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mySignature && !agreement.status.includes('both') && (
                <div className="saas-panel no-print" style={{ textAlign: 'center', padding: '40px' }}>
                    <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>You have signed!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Waiting for the other party to execute the agreement.</p>
                </div>
            )}

            {agreement.status === 'signed_both' && (
                <div className="saas-panel no-print" style={{ textAlign: 'center', padding: '40px', background: 'rgba(16, 185, 129, 0.1)', borderColor: '#10B981' }}>
                    <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Fully Executed</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Both parties have signed. You can now download the official PDF.</p>
                </div>
            )}
        </div>
    );
}

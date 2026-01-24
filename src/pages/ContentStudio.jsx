import { useState } from 'react';
import { Sparkles, Twitter, Linkedin, Send, Copy, RefreshCw, Zap, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ContentStudio() {
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('thread');
    const navigate = useNavigate();

    const handleGenerate = () => {
        if (!prompt) return;
        setGenerating(true);
        setResult(null);

        // Mock AI Delay
        setTimeout(() => {
            setGenerating(false);
            setResult(MOCK_GENERATIONS[selectedTemplate]);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button
                className="btn-ghost"
                style={{ marginBottom: '24px', paddingLeft: 0, display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => navigate(-1)}
            >
                <ChevronLeft size={18} /> Back
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

                {/* Left: Input Station */}
                <div className="saas-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Content Studio</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Turn raw ideas into viral founders content.</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label className="input-label" style={{ marginBottom: '12px', display: 'block' }}>Choose a Format</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                            <TemplateCard
                                icon={Twitter} label="Thread"
                                active={selectedTemplate === 'thread'}
                                onClick={() => setSelectedTemplate('thread')}
                            />
                            <TemplateCard
                                icon={Linkedin} label="Story"
                                active={selectedTemplate === 'linkedin'}
                                onClick={() => setSelectedTemplate('linkedin')}
                            />
                            <TemplateCard
                                icon={Zap} label="Hot Take"
                                active={selectedTemplate === 'hottake'}
                                onClick={() => setSelectedTemplate('hottake')}
                            />
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                        <label className="input-label">What's on your mind?</label>
                        <textarea
                            className="glass-input"
                            rows={8}
                            placeholder="e.g. We just launched our MVP but nobody is using it. I feel like quitting but I know I need to pivot..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            style={{ resize: 'none', lineHeight: 1.6 }}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleGenerate}
                        disabled={generating || !prompt}
                        style={{ justifyContent: 'center', height: '48px', fontSize: '1rem' }}
                    >
                        {generating ? <RefreshCw className="spin" size={20} /> : <Sparkles size={20} />}
                        {generating ? 'Brewing Content...' : 'Generate Viral Post'}
                    </button>
                </div>

                {/* Right: Output Preview */}
                <div className="saas-panel" style={{ padding: '32px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', opacity: result ? 1 : 0.5 }}>
                        Preview
                    </h3>

                    {!result && !generating && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.2 }}>📝</div>
                            <p>Ready to write history?</p>
                        </div>
                    )}

                    {generating && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                style={{ marginBottom: '24px' }}
                            >
                                <Sparkles size={48} color="var(--accent-primary)" />
                            </motion.div>
                            <p style={{ color: 'var(--text-secondary)' }}>Analyzing viral patterns...</p>
                        </div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{
                                background: selectedTemplate === 'twitter' ? 'rgba(29, 161, 242, 0.1)' : 'rgba(255,255,255,0.4)',
                                border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', padding: '24px',
                                whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '1.05rem', color: 'var(--text-primary)',
                                marginBottom: '24px'
                            }}>
                                {result}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div className="tag tag-green">Viral Score: 92/100</div>
                                    <div className="tag tag-blue">Sentiment: Vulnerable</div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button className="btn-ghost"><Copy size={18} /> Copy</button>
                                    <button className="btn-primary"><Send size={18} /> Post Now</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
}

function TemplateCard({ icon: Icon, label, active, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '16px', borderRadius: '12px', cursor: 'pointer',
                border: active ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.3)',
                background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s'
            }}
        >
            <Icon size={24} color={active ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{label}</span>
        </div>
    )
}

const MOCK_GENERATIONS = {
    thread: `1/ We launched our MVP 2 week ago.
    
    0 users. 
    0 feedback.
    100% panic.
    
    I told my cofounder we should shut it down. He told me to wait one more day.
    
    Here's what happened when we pivoted to "Founder-Led Sales" instead of ads 👇 
    
    (A thread on resilience)`,

    linkedin: `I almost quit my startup yesterday.
    
    The metrics were flat. The inbox was empty. The doubt was loud.
    
    It's easy to post about the wins. The massive funding rounds. The hockey stick growth.
    
    But nobody talks about the "Trough of Sorrow".
    
    We build in public to show the reality. And the reality is: sometimes it just sucks.
    
    But we show up anyway.
    
    #buildinpublic #startups #resilience`,

    hottake: `Most "MVPs" are just excuses for bad design.
    
    If you aren't embarrassed by your first version, you launched too late.
    
    But if your users are embarrassed to use it, you launched too ugly.
    
    There's a difference. Know it.`
};

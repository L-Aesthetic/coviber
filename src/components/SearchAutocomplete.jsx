import { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchAutocomplete({ candidates, onSelect, placeholder = "Search..." }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState({ people: [], roles: [], skills: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const containerRef = useRef(null);

    // 1. Process Data & Filter
    useEffect(() => {
        if (!query.trim()) {
            setSuggestions({ people: [], roles: [], skills: [] });
            return;
        }

        const lowerQuery = query.toLowerCase();

        // People
        const people = candidates
            .filter(c => c.name.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .map(c => ({ type: 'person', label: c.name, id: c.id, avatar: c.avatar_url }));

        // Roles (Extract unique)
        const allRoles = [...new Set(candidates.map(c => c.role))];
        const roles = allRoles
            .filter(r => r.toLowerCase().includes(lowerQuery))
            .slice(0, 2)
            .map(r => ({ type: 'role', label: r }));

        // Skills (Extract unique)
        const allSkills = [...new Set(candidates.flatMap(c => c.skills))];
        const skills = allSkills
            .filter(s => s.toLowerCase().includes(lowerQuery))
            .slice(0, 2)
            .map(s => ({ type: 'skill', label: s }));

        setSuggestions({ people, roles, skills });
        setSelectedIndex(-1);
    }, [query, candidates]);

    // 2. Flatten suggestions for keyboard nav
    const flatSuggestions = [
        ...suggestions.people,
        ...suggestions.roles,
        ...suggestions.skills
    ];

    // 3. Handle Keyboard
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % flatSuggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + flatSuggestions.length) % flatSuggestions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && flatSuggestions[selectedIndex]) {
                handleSelect(flatSuggestions[selectedIndex]);
            } else {
                onSelect(query); // Just search the text
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSelect = (item) => {
        setQuery(item.label);
        onSelect(item.label);
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                    type="text"
                    className="glass-input"
                    placeholder={placeholder}
                    style={{ paddingLeft: '56px', fontSize: '1.1rem', width: '100%' }}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            <AnimatePresence>
                {isOpen && flatSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="saas-panel"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '12px',
                            zIndex: 100,
                            padding: '8px',
                            background: 'rgba(20, 20, 30, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}
                    >
                        {suggestions.people.length > 0 && (
                            <SuggestionGroup title="People" icon={User}>
                                {suggestions.people.map((item, i) => (
                                    <SuggestionItem
                                        key={`p-${i}`}
                                        item={item}
                                        isSelected={selectedIndex === i}
                                        onClick={() => handleSelect(item)}
                                    />
                                ))}
                            </SuggestionGroup>
                        )}

                        {suggestions.roles.length > 0 && (
                            <SuggestionGroup title="Roles" icon={Briefcase}>
                                {suggestions.roles.map((item, i) => (
                                    <SuggestionItem
                                        key={`r-${i}`}
                                        item={item}
                                        isSelected={selectedIndex === (suggestions.people.length + i)}
                                        onClick={() => handleSelect(item)}
                                    />
                                ))}
                            </SuggestionGroup>
                        )}

                        {suggestions.skills.length > 0 && (
                            <SuggestionGroup title="Skills" icon={Star}>
                                {suggestions.skills.map((item, i) => (
                                    <SuggestionItem
                                        key={`s-${i}`}
                                        item={item}
                                        isSelected={selectedIndex === (suggestions.people.length + suggestions.roles.length + i)}
                                        onClick={() => handleSelect(item)}
                                    />
                                ))}
                            </SuggestionGroup>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SuggestionGroup({ title, icon: Icon, children }) {
    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px',
                fontSize: '0.75rem', fontWeight: 700,
                color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
                <Icon size={12} /> {title}
            </div>
            {children}
        </div>
    );
}

function SuggestionItem({ item, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isSelected ? 'var(--accent-primary)' : 'transparent',
                color: isSelected ? 'white' : 'var(--text-primary)',
                transition: 'all 0.1s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.type === 'person' && (
                    <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem'
                    }}>
                        {item.avatar ? <img src={item.avatar} alt="" style={{ width: '100%', height: '100%' }} /> : item.label[0]}
                    </div>
                )}
                <span style={{ fontWeight: 500 }}>{item.label}</span>
            </div>
            {isSelected && <ChevronRight size={14} />}
        </div>
    );
}

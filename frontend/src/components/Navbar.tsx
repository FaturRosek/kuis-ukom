import React from 'react';
import { BookOpen, Users, Database, FileUp, History, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const isPlaying = currentTab === 'solo-play';

  const navItems = [
    { id: 'home', label: 'Latihan Solo', shortLabel: 'Solo', icon: BookOpen },
    { id: 'multiplayer', label: 'Multiplayer', shortLabel: 'Multi', icon: Users },
    { id: 'bank-soal', label: 'Bank Soal', shortLabel: 'Bank Soal', icon: Database },
    { id: 'import', label: 'Impor Word/PDF', shortLabel: 'Impor', icon: FileUp },
    { id: 'history', label: 'Riwayat', shortLabel: 'Riwayat', icon: History },
  ];

  const getIsActive = (id: string) => {
    if (id === 'home') return currentTab === 'home' || currentTab === 'solo-play';
    if (id === 'multiplayer') return currentTab.startsWith('multiplayer');
    return currentTab === id;
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => onSelectTab('home')}>
            <div className="brand-icon">
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="brand-title">UKOM Quiz</span>
                <span className="brand-badge">PRO</span>
              </div>
            </div>
          </div>

          <nav className="desktop-nav">
            <ul className="nav-links">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = getIsActive(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nav-item-btn ${active ? 'active' : ''}`}
                      onClick={() => onSelectTab(item.id)}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {!isPlaying && (
        <nav className="mobile-bottom-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = getIsActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav-btn ${active ? 'active' : ''}`}
                onClick={() => onSelectTab(item.id)}
              >
                <div className="mobile-nav-icon-wrap">
                  <Icon size={20} />
                </div>
                <span className="mobile-nav-label">{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};

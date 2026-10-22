import React from 'react';
import { BookOpen, Users, Database, FileUp, History, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  return (
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

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item-btn ${currentTab === 'home' || currentTab === 'solo-play' ? 'active' : ''}`}
                onClick={() => onSelectTab('home')}
              >
                <BookOpen size={18} />
                Latihan Solo
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${currentTab.startsWith('multiplayer') ? 'active' : ''}`}
                onClick={() => onSelectTab('multiplayer')}
              >
                <Users size={18} />
                Multiplayer
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${currentTab === 'bank-soal' ? 'active' : ''}`}
                onClick={() => onSelectTab('bank-soal')}
              >
                <Database size={18} />
                Bank Soal
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${currentTab === 'import' ? 'active' : ''}`}
                onClick={() => onSelectTab('import')}
              >
                <FileUp size={18} />
                Impor Word/PDF
              </button>
            </li>
            <li>
              <button
                className={`nav-item-btn ${currentTab === 'history' ? 'active' : ''}`}
                onClick={() => onSelectTab('history')}
              >
                <History size={18} />
                Riwayat
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

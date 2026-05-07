import './App.css';
import { useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const apiRoot = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`;

const navItems = [
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark app-navbar shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">OctoFit Tracker</span>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="octofitNav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="octofitNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
              {navItems.map((item) => (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link px-3 rounded-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <a className="btn btn-outline-light btn-sm" href={apiRoot} target="_blank" rel="noreferrer">
              Open API Root
            </a>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <section className="card border-0 shadow-sm mb-4 hero-card">
          <div className="card-body p-4 p-lg-5">
            <h1 className="display-6 fw-semibold mb-2">Fitness Dashboard</h1>
            <p className="text-secondary mb-3">
              Explore activities, teams, users, workouts, and ranking data from the Django REST backend.
            </p>
            <p className="mb-0">
              <a className="link-light-emphasis link-offset-2" href={apiRoot} target="_blank" rel="noreferrer">
                {apiRoot}
              </a>
            </p>
          </div>
        </section>

        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

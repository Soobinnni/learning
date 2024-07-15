import { NavLink } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import NewsletterSignup from './NewsletterSignup';

const mainNavInfo = [
  {
    title: 'Home',
    path: '',
    option: true
  },
  {
    title: 'Events',
    path: 'events',
    option: false
  },
  {
    title: 'Newsletter',
    path: 'newsletter/',
    option: false
  },
  {
    title: 'Authentication',
    path: 'auth?mode=login',
    option: false
  },
]

function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          {
            mainNavInfo.map(nav => (
              <li key={nav.title}>
                <NavLink
                  to={`/${nav.path}`}
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }

                  end={nav.option}
                >
                  {nav.title}
                </NavLink>
              </li>
            ))
          }
        </ul>
      </nav>
      <NewsletterSignup />
    </header>
  );
}

export default MainNavigation;
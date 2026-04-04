'use client';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type MouseEvent,
} from 'react';
import { useColorScheme } from '@mui/material/styles';

const STORAGE_KEY = 'color-scheme';

type NavNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
};

/** Placeholder inbox items until notifications are wired to the backend. */
const PLACEHOLDER_NOTIFICATIONS: NavNotification[] = [
  {
    id: '1',
    title: 'Welcome to Sine',
    body: 'Your workspace is ready. Explore the sidebar to get started.',
    time: 'Just now',
  },
  {
    id: '2',
    title: 'Tip: keyboard shortcuts',
    body: 'Press ? anytime to see available shortcuts (coming soon).',
    time: '12m ago',
  },
  {
    id: '3',
    title: 'Weekly digest',
    body: 'You have no pending tasks this week.',
    time: '1d ago',
  },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const notifications = PLACEHOLDER_NOTIFICATIONS;
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const { mode, systemMode, setMode } = useColorScheme();

  const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut({ redirectTo: '/login' });
  };

  const user = session?.user;
  const initials =
    user?.name
      ?.split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?';

  useEffect(() => {
    const updateScrollTop = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsScrolledToTop(y < 1);
    };

    updateScrollTop();
    window.addEventListener('scroll', updateScrollTop, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollTop);
  }, []);

  const toggleDarkTheme = useCallback(() => {
    if (mode) {
      const currentMode = mode === 'dark' ? 'light' : 'dark';
      setMode(currentMode);
    }
  }, [mode, setMode]);

  if (!mode) {
    return null;
  }

  return (
    <Box
      component="header"
      className={`sticky transition-all duration-700 z-50 border border-divider backdrop-blur-md rounded-full ${
        isScrolledToTop
          ? 'top-0 shadow-none bg-background-paper mx-2'
          : 'shadow-md top-3 bg-background-paper/50 hover:bg-background-primary/50 mx-12'
      }`}
    >
      <Box className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-3 sm:gap-4 sm:px-4">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2 rounded-full p-1 outline-none transition hover:opacity-90 focus-visible:ring-2"
          aria-label="Home"
        >
          <Typography variant="h5">Sine</Typography>
        </Link>
        <div className="min-w-0 flex-1" />

        <div className="min-w-0 flex-1" />

        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton
            type="button"
            onClick={toggleDarkTheme}
            aria-label="Toggle color mode"
          >
            {mode === 'dark' ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton
            type="button"
            aria-label="Show notifications"
            aria-controls={notificationsOpen ? 'notifications-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={notificationsOpen ? 'true' : undefined}
            onClick={(e) => setNotificationsAnchorEl(e.currentTarget)}
          >
            <Badge
              badgeContent={notifications.length}
              color="primary"
              overlap="circular"
              max={9}
              invisible={notifications.length === 0}
            >
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          id="notifications-menu"
          anchorEl={notificationsAnchorEl}
          open={notificationsOpen}
          onClose={handleNotificationsClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box className="border-b px-3 py-2">
            <Typography variant="subtitle2" component="div" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          {notifications.length === 0 ? (
            <MenuItem disabled onClick={handleNotificationsClose}>
              No new notifications
            </MenuItem>
          ) : (
            notifications.map((n) => (
              <MenuItem
                key={n.id}
                onClick={handleNotificationsClose}
                className="flex flex-col items-stretch gap-1 py-2.5"
              >
                <Typography
                  variant="subtitle2"
                  component="span"
                  fontWeight={600}
                >
                  {n.title}
                </Typography>
                <Typography
                  variant="body2"
                  component="span"
                  color="text.secondary"
                  className="line-clamp-2 whitespace-normal"
                >
                  {n.body}
                </Typography>
                <Typography
                  variant="caption"
                  component="span"
                  color="text.disabled"
                >
                  {n.time}
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>

        <Tooltip title="Settings">
          <IconButton component={Link} href="/settings" aria-label="Settings">
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>

        <IconButton
          type="button"
          onClick={handleAvatarClick}
          aria-label="Account menu"
          aria-controls={menuOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          className="p-0.5"
        >
          <Avatar
            src={user?.image ?? undefined}
            alt={user?.name ?? 'Profile'}
            className="h-9 w-9 border border-zinc-600/40"
          >
            {status === 'loading' ? undefined : initials}
          </Avatar>
        </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { className: 'mt-1 min-w-[180px]' } }}
        >
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

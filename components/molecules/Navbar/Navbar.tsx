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
import { useEffect, useId, useState, type MouseEvent } from 'react';

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

function NavbarLogo({ isDark }: { isDark: boolean }) {
  const maskId = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 40 40"
      className={`h-9 w-9 shrink-0 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}
      aria-hidden
    >
      <defs>
        <mask id={maskId}>
          <rect width="40" height="40" fill="black" />
          <circle cx="20" cy="20" r="18" fill="white" />
          <path
            d="M 2 20 Q 11 11, 20 20 T 38 20"
            stroke="black"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <rect
        width="40"
        height="40"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}

export function Navbar() {
  const { data: session, status } = useSession();
  const [isDark, setIsDark] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const notifications = PLACEHOLDER_NOTIFICATIONS;

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const dark =
      stored === 'dark' ||
      (stored !== 'light' && stored === null && prefersDark);
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);
    queueMicrotask(() => setIsDark(dark));
  }, []);

  const toggleColorMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      const root = document.documentElement;
      root.classList.toggle('dark', next);
      root.classList.toggle('light', !next);
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

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

  return (
    <Box
      component="header"
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark
          ? 'border-zinc-800 bg-zinc-950/90'
          : 'border-zinc-200 bg-white/90'
      }`}
    >
      <Box className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-3 sm:gap-4 sm:px-4">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2 rounded-full p-1 outline-none ring-teal-500/40 transition hover:opacity-90 focus-visible:ring-2"
          aria-label="Home"
        >
          <NavbarLogo isDark={isDark} />
        </Link>
        <div className="min-w-0 flex-1" />

        <TextField
          size="small"
          placeholder="Search"
          className="min-w-0 flex-1"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    className={isDark ? 'text-zinc-500' : 'text-zinc-400'}
                    fontSize="small"
                  />
                </InputAdornment>
              ),
              className: isDark
                ? 'rounded-lg bg-zinc-900/80 text-zinc-100'
                : 'rounded-lg bg-zinc-100/80 text-zinc-900',
            },
          }}
          variant="outlined"
        />

        <div className="min-w-0 flex-1" />

        <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
          <IconButton
            type="button"
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            className={
              isDark
                ? 'text-zinc-300 hover:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-100'
            }
          >
            {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
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
            className={
              isDark
                ? 'text-zinc-300 hover:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-100'
            }
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
          slotProps={{
            paper: {
              className: `mt-1 max-h-[min(420px,70vh)] max-w-[min(360px,calc(100vw-24px))] overflow-auto ${
                isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'
              }`,
            },
          }}
        >
          <Box
            className={`border-b px-3 py-2 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}
          >
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
                className={`flex flex-col items-stretch gap-1 py-2.5 ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-50'
                }`}
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
          <IconButton
            component={Link}
            href="/settings"
            aria-label="Settings"
            className={
              isDark
                ? 'text-zinc-300 hover:bg-zinc-800'
                : 'text-zinc-600 hover:bg-zinc-100'
            }
          >
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

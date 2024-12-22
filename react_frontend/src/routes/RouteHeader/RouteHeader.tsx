import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { LC_AUTH_CALLBACK, LC_TOKEN, RouteHeaderProps } from "./types";
import { Suspense, useCallback, useEffect, useMemo } from "react";
import React from "react";
import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { TITLE_MAP } from "routes";
import { useGetUserMeQuery, useLogoutUserMutation } from "../../redux/api/baseApi";
import { matchPath } from "react-router-dom";
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import { usePermissions } from "hooks/usePermissions";

export function RouteHeader({ isProtected }: RouteHeaderProps) {
    const navigate = useNavigate();

    const { data: meData, isSuccess } = useGetUserMeQuery({});
    const [logout, logoutStatus] = useLogoutUserMutation();

    const logoutNoRedirect = useCallback(() => {
        logout({});
    }, [navigate]);

    useEffect(() => {
        if (isProtected && isSuccess && !meData.is_authenticated) {
            logout({});
        }
    }, [isProtected, meData, isSuccess, logout]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const currentLocation = useLocation();
    const params = useParams();

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setDrawerOpen(newOpen);
    };


    const { data: permissions, isSuccess: permissionsIsSuccess } = usePermissions();

    const shouldShowUsers = useMemo(() => {
        return permissionsIsSuccess && permissions.findIndex((item) => item === "django_backend.view_profile") !== -1;
    }, [permissions, permissionsIsSuccess]);

    return <>
        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                <List>
                    {[
                        { text: TITLE_MAP["/book-descriptions"]({}), icon: <LibraryBooksIcon />, to: "/book-descriptions" },
                        { text: TITLE_MAP["/genres"]({}), icon: <TheaterComedyIcon />, to: "/genres" },
                        { text: TITLE_MAP["/authors"]({}), icon: <LocalLibraryIcon />, to: "/authors" },
                        { text: TITLE_MAP["/publishing-houses"]({}), icon: <ApartmentIcon />, to: "/publishing-houses" },
                        { text: TITLE_MAP["/books"]({}), icon: <AutoStoriesIcon />, to: "/books" },
                        ...(shouldShowUsers ? [{ text: TITLE_MAP["/users"]({}), icon: <PersonIcon />, to: "/users" }] : [])
                    ].map(({ text, icon, to }, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => navigate(to)}>
                                <ListItemIcon>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
        <AppBar position="relative">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setDrawerOpen(!drawerOpen)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {Object.entries(TITLE_MAP).find(([key, _]) => !!matchPath(key, currentLocation.pathname))?.[1]?.(params)}
                </Typography>
                {!meData?.is_authenticated ? <Button color="inherit" onClick={() => {
                    localStorage.setItem(LC_AUTH_CALLBACK, window.location.href);
                    navigate("/login")
                }}>Войти</Button> : <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => navigate(`/users/${meData.user_id}`)}>Мой профиль</MenuItem>
                        <MenuItem onClick={logoutNoRedirect}>Выйти</MenuItem>
                    </Menu>
                </div>}
            </Toolbar>
        </AppBar>
        <Suspense fallback={"Мы всё почти загрузили!"}>
            <Box sx={{ minHeight: "100%", py: 4 }}>
                <Outlet />
            </Box>
        </Suspense>
    </>
}
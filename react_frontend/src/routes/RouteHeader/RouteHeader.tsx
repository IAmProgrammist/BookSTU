import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { LC_AUTH_CALLBACK, LC_TOKEN, RouteHeaderProps } from "./types";
import { Suspense, useCallback, useEffect } from "react";
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

    return <>
        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                <List>
                    {[
                        { text: 'Библиотека', icon: <LibraryBooksIcon/>, to: "/book-descriptions" },
                        { text: 'Жанры', icon: <TheaterComedyIcon/>, to: "/genres" },
                        { text: 'Авторы', icon: <LocalLibraryIcon/>, to: "/authors" },
                        { text: 'Издательства', icon: <ApartmentIcon/>, to: "/publishing-houses" }
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
                    {Object.entries(TITLE_MAP).find(([key, _]) => !!matchPath(currentLocation.pathname, key))?.[1]?.(params)}
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
                        <MenuItem onClick={handleClose}>Мой профиль</MenuItem>
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
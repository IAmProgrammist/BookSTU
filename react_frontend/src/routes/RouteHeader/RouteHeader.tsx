import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { LC_AUTH_CALLBACK, LC_TOKEN, RouteHeaderProps } from "./types";
import { Suspense, useCallback, useEffect } from "react";
import React from "react";
import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { TITLE_MAP } from "routes";
import { useGetUserMeQuery, useLogoutUserMutation } from "../../redux/api/baseApi";

export function RouteHeader({ isProtected }: RouteHeaderProps) {
    const navigate = useNavigate();

    const { data: meData, isSuccess } = useGetUserMeQuery({});
    const [logout, logoutStatus] = useLogoutUserMutation();

    const logoutNoRedirect = useCallback(() => {
        logout({});
    }, [navigate]);

    useEffect(() => {
        if (logoutStatus.isSuccess) {
            navigate("/login");
        }
    }, [logoutStatus]);

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

    return <>
        <AppBar position="fixed" >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {Object.entries(TITLE_MAP).find(([key, _]) => key === currentLocation.pathname)?.[1]?.(params)}
                </Typography>
                {!meData?.is_authenticated ? <Button color="inherit" onClick={logout}>Войти</Button> : <div>
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
            <Outlet />
        </Suspense>
    </>
}
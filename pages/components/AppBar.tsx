import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar, Divider, List, ListItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import { deepPurple } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import React, { FC, useEffect } from "react";
import { Task } from "./Tasks";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

interface AppBarProps {
  setSearch: (string) => void;
  user: any;
  setUser: (user: any) => void;
  setTasksState: (tasks: Task[]) => void;
  allTasks: Task[];
}

export const MyAppBar: FC<AppBarProps> = ({
  setSearch,
  setUser,
  user,
  setTasksState,
  allTasks,
}) => {
  useEffect(() => {}, [allTasks]);

  const tasks =
    user && allTasks
      ? allTasks.filter((task) => task.user && task.user === user.name)
      : [];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorNotify, setAnchorNotify] = React.useState<null | HTMLElement>(
    null
  );
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const notViewTasks = tasks.map((task) => ({
    taskName: task.name,
    usersLike: task.usersLike,
  }));
  const tasksDoesntView = notViewTasks.filter((task) => {
    return task.usersLike?.some((task) => !task.view);
  });

  const notViewedCommnet = tasks.filter((task) => {
    return task.comments && task.comments?.some((task) => !task.view);
  });

  const menuItems = notViewTasks.map((t) => {
    const name = t.taskName;
    return { taskName: name, users: t.usersLike?.map((u) => u.name) };
  });

  let a: any[] = [];

  menuItems.map((t) => {
    t.users?.forEach((user) => {
      a.push({ taskName: t.taskName, user: user });
    });
  });

  const toRender = a.map((u) => {
    const name = u.user.split(" ");
    return (
      <>
        <ListItem
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar style={{ margin: 4 }} sx={{ bgcolor: deepPurple[500] }}>
            {name[0][0] + name[1][0]}
          </Avatar>
          <Typography>
            {u.user} Like your task {u.taskName}
          </Typography>
        </ListItem>
        <Divider />
      </>
    );
  });

  const myComments = tasks.map((task) => {
    const users = task.comments?.map((c) => c.name);
    const comments = task.comments?.map((c) => c.comment);
    return { taskName: task.name, users: users, comments: comments };
  });

  const toRender2 = myComments.map((t) => {
    let r: JSX.Element[] = [];
    if (t.users && t.comments) {
      for (let index = 0; index < t.users.length; index++) {
        const user = t.users[index];
        const avatar = user.split(" ")[0][0] + user.split(" ")[1][0];
        const comment = t.comments[index];
        r.push(
          <>
            <ListItem
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar style={{ margin: 4 }} sx={{ bgcolor: deepPurple[500] }}>
                {avatar}
              </Avatar>
              <Typography>
                {user} post comment on your task {t.taskName} : {comment}
              </Typography>
            </ListItem>
            <Divider />
          </>
        );
      }
    }
    return r;
  });
  console.log({ toRender });

  const isMenuOpen = Boolean(anchorEl);
  const isNotifyOpen = Boolean(anchorNotify);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlenotifyWindowOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotify(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleNotifyClose = () => {
    const newTasks = allTasks.map((task) => {
      if (task.user === user.name) {
        const usersLikeNew = task.usersLike?.map((t) => {
          return { ...t, view: true };
        });
        const usersCommentNew = task.comments?.map((t) => {
          return { ...t, view: true };
        });
        fetch(`http://localhost:3000/api/editTask/${task.id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            ...task,
            usersLike: usersLikeNew,
            comments: usersCommentNew,
          }),
        });
        return { ...task, usersLike: usersLikeNew, comments: usersCommentNew };
      }
      return { ...task };
    });
    setTasksState(newTasks);

    setAnchorNotify(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {user?.email ? (
        <div>
          <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem("user");
              setUser(null);
              setAnchorEl(null);
            }}
          >
            Logout
          </MenuItem>
        </div>
      ) : (
        <Link href="/login">
          <MenuItem onClick={handleMenuClose}>Login</MenuItem>
        </Link>
      )}
    </Menu>
  );
  const renderNotify = toRender.length + toRender2.length > 0 && (
    <Menu
      anchorEl={anchorNotify}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={isNotifyOpen}
      onClose={handleNotifyClose}
      PaperProps={{ style: { top: 45, left: 1258 } }}
    >
      <List>
        {toRender}
        {toRender2}
      </List>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        style={{ backgroundColor: "rgba(0, 0, 0, 0.0)" }}
        position="static"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          ></IconButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "flex" } }}
            width={"100%"}
            justifyContent={"center"}
          >
            DO-IT
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handlenotifyWindowOpen}
            >
              <Badge
                badgeContent={tasksDoesntView.length + notViewedCommnet.length}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user === null ? (
                <AccountCircle />
              ) : (
                <Avatar sx={{ bgcolor: deepPurple[500] }}>
                  {user.given_name[0] + user.family_name[0]}
                </Avatar>
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotify}
    </Box>
  );
};

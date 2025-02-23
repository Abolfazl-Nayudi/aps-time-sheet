"use client";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { userAuthType } from "@/types/userStateType";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  user: userAuthType;
}

const drawerWidth = 240;
const navItems = [
  { name: "Home", path: "/" },
  { name: "Users", path: "/admin/users" },
  { name: "Tasks", path: "/admin/tasks" },
];
// const navItems = ["Home", "About", "Contact"];

export default function AdminNavbarComponent(props: Props) {
  const session = useSession();
  const { window, user } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ name, path }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link href={path} style={{ color: "inherit", textDecoration: "none" }}>
                <ListItemText primary={name} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ position: "static" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            MUI
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map(({ name, path }) => (
              <Button key={name} sx={{ color: "#fff" }}>
                <Link href={path} style={{ color: "inherit", textDecoration: "none" }}>
                  {name}
                </Link>
              </Button>
            ))}
          </Box>

          {user?.userId && (
            <Button
              variant="contained"
              color="error"
              sx={{ display: "inline-block", marginLeft: "2rem" }}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Log out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

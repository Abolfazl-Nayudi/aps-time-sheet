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
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

import logo from "@/public/Logo/dark-mode.png";
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
  { name: "My Tasks", path: "/dashboard/tasks" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Admin Panel", path: "/admin" },
];
// const navItems = ["Home", "About", "Contact"];

export default function AdminNavbarComponent(props: Props) {
  const pathname = usePathname();
  console.log(pathname);

  const { window, user } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box component="div" sx={{ flexGrow: 1, marginY: 2, display: { xs: "block", sm: "none" } }}>
        <Image src={logo} alt="logo" width={50} />
      </Box>
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
      <AppBar component="nav" sx={{ position: "static", backgroundColor: "#ffffff" }}>
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
          <Box component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            <Image src={logo} alt="logo" width={50} />
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map(({ name, path }) => (
              <Button
                key={name}
                LinkComponent={Link}
                href={path}
                sx={{
                  color: `${pathname === path ? "#e74924" : "black"}`,
                  position: "relative",
                  textTransform: "capitalize",

                  "&:hover": { color: "#e74924", background: "none", "&::after": { width: "90%" } },
                  "&::after": {
                    content: `" "`,
                    display: "inline-block",
                    position: "absolute",
                    transition: "all .2s ease",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${pathname === path ? "90%" : "0%"}`,
                    height: 3,
                    backgroundColor: "#e74924",
                    borderRadius: "5px",
                    // borderBottom: `${pathname === path ? "1px solid #e74924" : "none"}`,
                  },
                }}
                disableRipple
              >
                {name}
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

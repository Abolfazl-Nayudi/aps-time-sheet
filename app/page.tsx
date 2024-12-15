import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";

import { auth } from "@/utils/authOptions";

const Home = async () => {
  const { getUser } = await auth();
  const user = getUser();
  console.log(user);
  return (
    <Box component={"section"}>
      <Box marginTop={"10rem"} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={2}>
        <Typography variant="h3" textAlign={"center"} component={"h1"}>
          Welcome To APSignals Time Sheet
        </Typography>
        {user?.userId ? (
          <Button variant="contained" sx={{ textTransform: "none", fontSize: 20 }}>
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Go To Dashboard
            </Link>
          </Button>
        ) : (
          <Button variant="contained" sx={{ textTransform: "none", fontSize: 20 }}>
            <Link href={"/login"} style={{ textDecoration: "none", color: "inherit" }}>
              Log In To Your Account
            </Link>
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default Home;

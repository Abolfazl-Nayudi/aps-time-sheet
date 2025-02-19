"use client";

import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import avatar from "@/public/avatar.png";

import { getUsersList } from "./actions/getUsersList";

type UsersData = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role: "USER" | "ADMIN";
};

export default function AdminUsersList() {
  const [usersData, setUsersData] = useState<UsersData[] | []>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { status, data, message } = await getUsersList();

      if (status === "error" && message === "unauthenticated") {
        return router.push("/");
      }

      if (status === "error") {
        setMessage(message);
        return;
      }
      if (data) {
        setUsersData(data);
      }
    };

    fetchData();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  return (
    <Box component={"section"} display={"flex"} justifyContent={"center"} marginTop={"4rem"}>
      <Box width={900}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>avatar</TableCell>
                <TableCell align="center">Full Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">is Admin</TableCell>
                {/* <TableCell align="center">status</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.map(({ email, firstName, lastName, id, role }) => (
                <TableRow
                  onClick={() => handleClick(id)}
                  key={id}
                  sx={{
                    cursor: "pointer",
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Image src={avatar} alt="avatar" width={40} height={40} style={{ borderRadius: "50%" }} />
                  </TableCell>
                  <TableCell align="center">{`${firstName} ${lastName}`}</TableCell>
                  <TableCell align="center">{email}</TableCell>
                  <TableCell align="center">{role}</TableCell>
                  {/* <TableCell align="center">
                    <Button variant="contained">Change Status</Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {status === "error" && (
          <Typography color={"crimson"} variant="h3">
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

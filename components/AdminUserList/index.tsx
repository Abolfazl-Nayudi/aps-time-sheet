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

const fakeUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    firstName: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    firstName: "Emma",
    lastName: "Davis",
    email: "emma.davis@example.com",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
];

type UsersData = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
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
                {/* <TableCell align="center">Carbs&nbsp;(g)</TableCell>
            <TableCell align="center">Protein&nbsp;(g)</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.map(({ email, firstName, lastName, id }) => (
                <TableRow
                  onClick={e => handleClick(id)}
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
                  {/* <TableCell align="center">{row.carbs}</TableCell>
              <TableCell align="center">{row.protein}</TableCell> */}
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

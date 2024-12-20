"use client";

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Image from "next/image";

import avatar from "@/public/avatar.png";

import { UserData } from "..";
const UserInformation = ({ id, email, firstName, lastName }: UserData) => {
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
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Image src={avatar} alt="avatar" width={40} height={40} style={{ borderRadius: "50%" }} />
                </TableCell>
                <TableCell align="center">{`${firstName} ${lastName}`}</TableCell>
                <TableCell align="center">{email}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UserInformation;

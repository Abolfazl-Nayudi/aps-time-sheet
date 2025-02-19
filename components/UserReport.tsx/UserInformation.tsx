"use client";

import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

import avatar from "@/public/avatar.png";

import { UserData } from ".";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
const UserInformation = ({ id, email, firstName, lastName, role }: UserData) => {
  const [openChangeUserRoleModal, setopenChangeUserRoleModal] = useState(false);

  return (
    <>
      <Box component={"section"} display={"flex"} justifyContent={"center"} marginTop={"4rem"}>
        <Box width={900}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>avatar</TableCell>
                  <TableCell align="center">Full Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Action</TableCell>
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
                  <TableCell align="center">{role}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" onClick={() => setopenChangeUserRoleModal(true)}>
                      Change
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <ChangeUserRoleModal
        open={openChangeUserRoleModal}
        setOpen={setopenChangeUserRoleModal}
        userData={{ firstName, lastName, role, id, email }}
      />
    </>
  );
};

export default UserInformation;

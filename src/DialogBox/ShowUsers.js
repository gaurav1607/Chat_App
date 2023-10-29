import { Avatar, Card, Typography } from '@mui/material'
import React from 'react'

const ShowUsers = ({userInfo,handleGroupMembers}) => {
  return (
    <Card
      onClick={()=>{handleGroupMembers(userInfo)}}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 1,
        padding: "7px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar sx={{ marginRight: 2 }} alt={` Avatar`} />
        <div>
          <Typography variant="h6">{userInfo.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            email : {userInfo.email}
          </Typography>
        </div>
      </div>
      {/* <Typography variant="body2" color="text.secondary">
        Last seen: 2 Am
      </Typography> */}
    </Card>
  )
}

export default ShowUsers
  import Dialog from "@mui/material/Dialog";
  import DialogTitle from "@mui/material/DialogTitle";
  import DialogContent from "@mui/material/DialogContent";
  import DialogActions from "@mui/material/DialogActions";
  import Button from "@mui/material/Button";
  import Avatar from '@mui/material/Avatar';

  export const SelectBox = ({ open, handleClose, setProfilePic }) => {

    const images = [
      "/avatars/1.png",
      "/avatars/2.png",
      "/avatars/3.png",
      "/avatars/4.png",
      "/avatars/5.png",
      "/avatars/6.png",
      "/avatars/7.png",
      "/avatars/8.png",
      "/avatars/9.png",
    ];

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Avtar</DialogTitle>
        <DialogContent sx={{display:"flex",width:"30vw",flexWrap:"wrap"}}>
          {images.map((image,i) => {
            return (
              <Avatar
                key={i}
                alt={image}
                src={image}
                sx={{ width: 100, height: 100, margin:"14px",cursor: "pointer"}}
                onClick={()=>{setProfilePic(images[i])
                  handleClose()}}
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

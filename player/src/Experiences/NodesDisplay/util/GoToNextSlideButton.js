import { Icon, IconButton } from "@mui/material";
import { backgroundColor, primaryColor, secondaryColor } from "../../../themes";

export default function GoToNextSlideButton(props) {
  const { setNextNode, possibleNextNodes } = props;

  return (
    <IconButton
      sx={{
        backgroundColor: secondaryColor,
        borderColor: primaryColor,
        borderWidth: 2,
        borderStyle: "solid",
        position: "fixed",
        bottom: 75,
        right: "15px",
        "&:hover": {
          backgroundColor: primaryColor,
          borderColor: secondaryColor,
          color: secondaryColor + " !important",
          borderWidth: 2,
          borderStyle: "solid",
        },
      }}
      onClick={() => {
        setNextNode(possibleNextNodes[0]);
      }}
    >
      <Icon
        color="inherit"
        sx={{
          fontSize: "40px !important",
        }}
      >
        skip_next
      </Icon>
    </IconButton>
  );
}

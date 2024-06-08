import { Box, Typography } from "@mui/material";

export default function CharacterIconDisplay(props) {
  const characterName = props.characterName;
  const characterFilepath = props.characterFilepath;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        height: "100%",
        mb: 2,
      }}
    >
      <img
        src={characterFilepath}
        alt={characterName}
        onError={(e) => {
          e.target.src = "./assets/character_dialogue_node.png";
        }}
        style={{
          width: "120px",
          height: "120px",
          padding: "3px",
          borderRadius: "50%",
          border: "2px solid black",
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          backgroundColor: "white",
          border: "2px solid black",
          borderRadius: "5px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            px: 3,
            py: 1,
            fontSize: 20,
            color: "black",
            fontWeight: 200,
            whiteSpace: "pre-wrap",
          }}
        >
          {characterName}
        </Typography>
      </Box>
    </Box>
  );
}

"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

type CardNavigatorProps = {
  id: string;
  title: string;
  description: string;
  path: string;
};

function CardNavigator({ id, title, description, path }: CardNavigatorProps) {
  const router = useRouter();

  return (
    <Card key={id}>
      <CardActionArea
        onClick={() => router.push(path)}
        // sx={{
        //   height: "100%",
        //   "&[data-active]": {
        //     backgroundColor: "action.selected",
        //     "&:hover": {
        //       backgroundColor: "action.selectedHover",
        //     },
        //   },
        // }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardNavigator;

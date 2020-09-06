import { createStyles, Grid } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100vw",
      height: "100vh",
    },
  })
);

export const Scaffold: FunctionComponent = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.root}
      justify="center"
      alignItems="center"
      direction="column"
    >
      {children}
    </Grid>
  );
};

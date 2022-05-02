import React from "react";
import { createUseStyles } from "react-jss";
import { GoodfoodRecipeListItem } from "../utils/types";

const useStyles = createUseStyles({
  container: {
    width: "400px",
    height: "400px",
    display: "inline-block",
    margin: "8px",
  },
  image: {
    width: "100%",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginSmall: {
    margin: "8px",
  },
  buttonUnpicked: {
    background: "white",
    width: "80px",
    height: "80px",
    margin: "8px",
  },
  buttonPicked: {
    background: "lightgreen",
    width: "80px",
    height: "80px",
    margin: "8px",
  },
});

interface Props {
  recipeData: GoodfoodRecipeListItem;
  pickRecipePressed: (recipeLink: string) => void;
  pickedRecipeLinks: { [key: string]: boolean };
}

export const RecipeCard = ({
  recipeData,
  pickRecipePressed,
  pickedRecipeLinks,
}: Props) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <a href={recipeData.link} target="_blank" rel="noreferrer">
        <img src={recipeData.image} className={styles.image} />
      </a>
      <div className={styles.titleContainer}>
        <div style={{}}>
          <h3 className={styles.marginSmall}>{recipeData.title}</h3>
          <h4 className={styles.marginSmall}>{recipeData.detail}</h4>
        </div>
        <button
          className={
            recipeData.link in pickedRecipeLinks
              ? styles.buttonPicked
              : styles.buttonUnpicked
          }
          onClick={() => pickRecipePressed(recipeData.link)}
        >
          {recipeData.link in pickedRecipeLinks ? "Picked" : "Pick me"}
        </button>
      </div>
    </div>
  );
};

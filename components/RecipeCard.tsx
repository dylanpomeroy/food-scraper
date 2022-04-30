import React from "react";
import styles from "../styles/Home.module.css";
import { GoodfoodRecipeListItem } from "../utils/types";

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
  return (
    <div className={styles.recipeListItem}>
      <a href={recipeData.link} target="_blank" rel="noreferrer">
        <img src={recipeData.image} className={styles.recipeListItemImage} />
      </a>
      <div className={styles.recipeListItemTitles}>
        <div style={{}}>
          <h3 className={styles.marginSmall}>{recipeData.title}</h3>
          <h4 className={styles.marginSmall}>{recipeData.detail}</h4>
        </div>
        <button
          className={
            recipeData.link in pickedRecipeLinks
              ? styles.recipeListItemButtonPicked
              : styles.recipeListItemButtonUnpicked
          }
          onClick={() => pickRecipePressed(recipeData.link)}
        >
          {recipeData.link in pickedRecipeLinks ? "Picked" : "Pick me"}
        </button>
      </div>
    </div>
  );
};

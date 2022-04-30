import React from "react";
import styles from "../styles/Home.module.css";
import { GoodfoodRecipeListItem } from "../utils/types";
import { RecipeCard } from "./RecipeCard";

interface Props {
  recipeListData: GoodfoodRecipeListItem[];
  pickedRecipeLinks: { [key: string]: boolean };
  setPickedRecipeLinks: (pickedRecipeLinks: { [key: string]: boolean }) => void;
  submitButtonRef: React.MutableRefObject<any>;
  submitUrls: () => void;
}

export const RecipeSelector = ({
  recipeListData,
  pickedRecipeLinks,
  setPickedRecipeLinks,
  submitButtonRef,
  submitUrls,
}: Props) => {
  const selectedRecipeCount = Object.keys(pickedRecipeLinks).length;

  const pickRecipePressed = (recipeLink: string) => {
    if (!(recipeLink in pickedRecipeLinks)) {
      pickedRecipeLinks[recipeLink] = true;
      setPickedRecipeLinks({ ...pickedRecipeLinks });
    } else {
      delete pickedRecipeLinks[recipeLink];
      setPickedRecipeLinks({ ...pickedRecipeLinks });
    }
  };

  return (
    <div className={styles.recipeSelectorContainer}>
      <p className={styles.pickedAmountLabel}>
        Picked <b>{selectedRecipeCount}</b> recipes.
      </p>
      <div className={styles.recipeListContainer}>
        {recipeListData.map((recipeData, index) => (
          <RecipeCard
            recipeData={recipeData}
            key={index}
            pickRecipePressed={pickRecipePressed}
            pickedRecipeLinks={pickedRecipeLinks}
          />
        ))}
      </div>

      <button
        ref={submitButtonRef}
        className={styles.button}
        onClick={() => submitUrls()}
      >
        Submit
      </button>
    </div>
  );
};

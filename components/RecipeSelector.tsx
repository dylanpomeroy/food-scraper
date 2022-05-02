import React from "react";
import { createUseStyles } from "react-jss";
import { GoodfoodRecipeListItem } from "../utils/types";
import { RecipeCard } from "./RecipeCard";

const useStyles = createUseStyles({
  container: {
    textAlign: "center",
  },
  pickedAmountLabel: {
    fontSize: "20px",
    textAlign: "center",
  },
  listContainer: {
    border: "1px solid black",
    maxHeight: "70vh",
    width: "100%",
    overflow: "scroll",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    height: "50px",
    width: "200px",
    fontSize: "20px",
    margin: "20px",
  },
});

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
  const style = useStyles();

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
    <div className={style.container}>
      <p className={style.pickedAmountLabel}>
        Picked <b>{selectedRecipeCount}</b> recipes.
      </p>
      <div className={style.listContainer}>
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
        className={style.button}
        onClick={() => submitUrls()}
      >
        Submit
      </button>
    </div>
  );
};

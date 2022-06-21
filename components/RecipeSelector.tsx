import React from "react";
import { createUseStyles } from "react-jss";
import { RecipeListItem } from "../utils/types";
import { RecipeCard } from "./RecipeCard";
import { Button, Text, Container } from "@mantine/core";

const useStyles = createUseStyles({
  container: {
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
  recipeListData: RecipeListItem[];
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
    <Container className={style.container} fluid>
      <Text size="xl">Picked {selectedRecipeCount} recipes.</Text>

      <Container className={style.listContainer} fluid>
        {recipeListData.map((recipeData, index) => (
          <RecipeCard
            recipeData={recipeData}
            key={index}
            pickRecipePressed={pickRecipePressed}
            pickedRecipeLinks={pickedRecipeLinks}
          />
        ))}
      </Container>

      <Button
        ref={submitButtonRef}
        className={style.button}
        onClick={() => submitUrls()}
        color="green"
        disabled={Object.keys(pickedRecipeLinks).length === 0}
      >
        Submit
      </Button>
    </Container>
  );
};

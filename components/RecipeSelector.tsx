import React from "react";
import { RecipeListItem } from "../utils/types";
import { RecipeCard } from "./RecipeCard";
import { Container, Group, ScrollArea } from "@mantine/core";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  scrollArea: {
    height: "calc(100vh - 170px)",
  },
});

interface Props {
  recipeListData: RecipeListItem[];
  pickedRecipeLinks: { [key: string]: boolean };
  setPickedRecipeLinks: (pickedRecipeLinks: { [key: string]: boolean }) => void;
}

export const RecipeSelector = ({
  recipeListData,
  pickedRecipeLinks,
  setPickedRecipeLinks,
}: Props) => {
  const styles = useStyles();

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
    <Container fluid>
      <ScrollArea className={styles.scrollArea} my="xl">
        <Group position="center">
          {recipeListData.map((recipeData, index) => (
            <RecipeCard
              recipeData={recipeData}
              key={index}
              pickRecipePressed={pickRecipePressed}
              pickedRecipeLinks={pickedRecipeLinks}
            />
          ))}
        </Group>
      </ScrollArea>
    </Container>
  );
};

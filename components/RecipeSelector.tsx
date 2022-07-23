import React from "react";
import { RecipeListItem } from "../utils/types";
import { RecipeCard } from "./RecipeCard";
import { Container, Group, ScrollArea } from "@mantine/core";

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
    <Container p={0} fluid>
      <ScrollArea>
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

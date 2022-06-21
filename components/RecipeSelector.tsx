import React from "react";
import { RecipeListItem } from "../utils/types";
import { RecipeCard } from "./RecipeCard";
import {
  Button,
  Text,
  Container,
  Group,
  Center,
  ScrollArea,
} from "@mantine/core";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  scrollArea: {
    height: "75vh",
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
  const selectedRecipeCount = Object.keys(pickedRecipeLinks).length;

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
      <Center>
        <Text size="xl">Picked {selectedRecipeCount} recipes.</Text>
      </Center>
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
      <Center>
        <Button
          ref={submitButtonRef}
          size="xl"
          onClick={() => submitUrls()}
          color="green"
          disabled={Object.keys(pickedRecipeLinks).length === 0}
        >
          Submit
        </Button>
      </Center>
    </Container>
  );
};

import React from "react";
import { createUseStyles } from "react-jss";
import { RecipeListItem } from "../utils/types";
import { Button, Container, Image, Anchor, Text, Card } from "@mantine/core";

const useStyles = createUseStyles({
  container: {
    width: "375px",
    height: "364px",
  },
  containerMobile: {
    width: "80vw",
    height: "80vw",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  button: {
    minWidth: "80px",
    width: "80px",
    height: "113px",
    borderRadius: "0px",
    borderBottomRightRadius: "32px",
  },
});

interface Props {
  recipeData: RecipeListItem;
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
    <>
      <Card
        withBorder
        shadow="xl"
        m={0}
        mb="lg"
        radius="xl"
        className={styles.container}
      >
        <Card.Section>
          <Anchor href={recipeData.link} target="_blank" rel="noreferrer">
            <Image src={recipeData.image} alt={`Dish of ${recipeData.title}`} />
          </Anchor>
        </Card.Section>

        <Card.Section className={styles.titleContainer}>
          <Container px={5}>
            <Text size="lg" weight="bold">
              {recipeData.title}
            </Text>
            <Text size="md">{recipeData.detail}</Text>
          </Container>
          <Button
            className={styles.button}
            size="lg"
            compact
            color="green"
            variant={
              recipeData.link in pickedRecipeLinks ? "filled" : "outline"
            }
            onClick={() => pickRecipePressed(recipeData.link)}
          >
            {recipeData.link in pickedRecipeLinks ? "Picked" : "Pick"}
          </Button>
        </Card.Section>
      </Card>
    </>
  );
};

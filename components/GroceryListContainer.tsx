import React from "react";
import update from "immutability-helper";
import type { FC } from "react";
import { useCallback } from "react";

import { Card } from "./GroceryListItem";
import { createUseStyles } from "react-jss";

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

interface Props {
  cards: Item[];
  setCards: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        text: string;
      }[]
    >
  >;
  confirmButtonRef: React.MutableRefObject<any>;
}

const useStyles = createUseStyles({
  button: {
    height: "50px",
    width: "200px",
    fontSize: "20px",
    margin: "20px",
  },
  container: {
    width: 400,
  },
});

export const GroceryListContainer: FC<Props> = ({
  cards,
  setCards,
  confirmButtonRef,
}: Props) => {
  const style = useStyles();
  console.log(cards);
  const deleteItem = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const setItemText = (id: number, newText: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { id: card.id, text: newText } : card
      )
    );
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: Item[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Item],
        ],
      })
    );
  }, []);

  const renderCard = useCallback(
    (card: { id: number; text: string }, index: number) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
          deleteItem={deleteItem}
          setItemText={setItemText}
        />
      );
    },
    []
  );

  return (
    <>
      <h2>Order Grocery List</h2>
      <p>
        Drag items to reorder, select the text to edit items, or press the X to
        remove them
      </p>
      <div className={style.container}>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </>
  );
};

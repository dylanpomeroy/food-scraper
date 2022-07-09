import React, { useState } from "react";
import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { ItemTypes } from "./ItemTypes";
import { Button, Card, TextInput } from "@mantine/core";
import { GrDrag, GrClose } from "react-icons/gr";
import { createUseStyles } from "react-jss";

export interface CardProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  deleteItem: (id: number) => void;
  setItemText: (id: number, newText: string) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const useStyles = createUseStyles({
  dragArea: {
    display: "inline-block",
    padding: "7.5px 18px",
  },
  dragIcon: {
    position: "relative",
    top: "2px",
  },
  listItemInput: {
    display: "inline-block",
    width: "306px",
  },
});

export const GroceryListItem: FC<CardProps> = ({
  id,
  text,
  index,
  moveCard,
  deleteItem,
  setItemText,
}) => {
  const styles = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  const [canDrag, setCanDrag] = useState(false);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop() {
      setCanDrag(false);
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => canDrag,
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <Card
      px={0}
      py={"sm"}
      mb={"sm"}
      withBorder={true}
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div
        // only drag the list item when dragging from this icon
        onMouseDown={() => setCanDrag(true)}
        className={styles.dragArea}
      >
        <GrDrag className={styles.dragIcon} />
      </div>

      <div className={styles.listItemInput}>
        <TextInput
          value={text}
          onChange={(e) => setItemText(id, e.target.value)}
        />
      </div>

      <Button variant={"subtle"} px={"sm"} onClick={() => deleteItem(id)}>
        <GrClose />
      </Button>
    </Card>
  );
};

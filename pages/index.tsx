import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import recipePrinter from "../utils/recipePrinter";
import { RecipeListItem, SettingsData } from "../utils/types";
import Config from "../components/Config";
import { RecipeSelector } from "../components/RecipeSelector";
import { createUseStyles } from "react-jss";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GroceryListContainer } from "../components/GroceryListContainer";
import { Button, Group, Title } from "@mantine/core";
import Image from "next/image";

const useStyles = createUseStyles({
  container: {
    minHeight: "100vh",
    padding: "0 0.4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: "50px",
    width: "200px",
    fontSize: "20px",
    margin: "20px",
  },
  markdownTextArea: {
    border: "1px solid black",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "space-between",
    margin: "8px 16px 16px 16px",
  },
  "@media (max-width: 649px)": {
    header: {
      justifyContent: "center",
    },
  },
});

const steps = ["pick-recipes", "order-grocery-list", "export"];

const Home = () => {
  const style = useStyles();

  const [step, setStep] = useState(steps[0]);

  const [responseMarkdown, setResponseMarkdown] = useState("");
  const [recipeListData, setRecipeListData] = useState<RecipeListItem[]>([]);
  const [pickedRecipeLinks, setPickedRecipeLinks] = useState<{
    [key: string]: boolean;
  }>({});

  const [recipeSubstringsDenyList, setRecipeSubstringsDenyList] = useState([]);
  const [removeSubstrings, setRemoveSubstrings] = useState([]);
  const [orderSubstrings, setOrderSubstrings] = useState([]);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const submitButtonRef = useRef(null);
  const confirmListButtonRef = useRef(null);
  const markdownTextAreaRef = useRef(null);

  const [recipeData, setRecipeData] = useState<any>();
  const [groceryListItems, setGroceryListItems] = useState<
    { id: number; text: string }[]
  >([]);

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    parseRecipesPage();
  }, [recipeSubstringsDenyList]);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await axios.get<SettingsData>("/api/settings");

      if (response.data.recipeSubstringsDenyList)
        setRecipeSubstringsDenyList(response.data.recipeSubstringsDenyList);
      if (response.data.removeSubstrings)
        setRemoveSubstrings(response.data.removeSubstrings);
      if (response.data.orderSubstrings)
        setOrderSubstrings(response.data.orderSubstrings);
    };

    fetchSettings();
  }, []);

  const submitUrls = async () => {
    setResponseMarkdown("");
    const recipeData = await axios.post("/api/recipes", {
      urlInfo: Object.keys(pickedRecipeLinks).map((recipeLink) => ({
        source: "goodfood",
        url: recipeLink,
      })),
    });

    setRecipeData(recipeData);

    const groceryListItems = recipePrinter.getGroceryList(
      recipeData.data,
      removeSubstrings,
      orderSubstrings
    );
    setGroceryListItems(
      groceryListItems.map((groceryListItem, index) => ({
        id: index,
        text: groceryListItem,
      }))
    );
  };

  const parseRecipesPage = async () => {
    const recipeListData: any = await axios.get("/api/recipes", {
      params: {
        recipeSources: "goodfood",
        recipeSubstringsDenyList: recipeSubstringsDenyList.join(","),
      },
    });
    setRecipeListData(recipeListData.data.goodfood);
  };

  useEffect(() => {
    submitUrls();
  }, [pickedRecipeLinks]);

  useEffect(() => {
    if (recipeData) {
      confirmGroceryListItems();
    }
  }, [recipeData, groceryListItems]);

  const pageRootRef = useRef(null);

  const confirmGroceryListItems = () => {
    const today = new Date();
    const dateString = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    const newResponseMarkdown = recipePrinter.getMarkdownPageContent(
      recipeData.data,
      groceryListItems.map((item) => item.text),
      dateString
    );
    setResponseMarkdown(newResponseMarkdown);

    if (navigator.clipboard) {
      navigator.clipboard?.writeText(newResponseMarkdown);
      setCopiedToClipboard(true);
    } else {
      setCopiedToClipboard(false);
    }
  };

  return (
    <div ref={pageRootRef}>
      <Head>
        <title>Food Scraper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={style.header}>
        <Group mx="xs">
          <Image src="/burger-flat.svg" width="32" height="32" />
          <Title>Food Scraper</Title>
        </Group>
        <div>
          <Button
            size="lg"
            disabled={steps.indexOf(step) === 0}
            onClick={() => setStep(steps[steps.indexOf(step) - 1])}
          >
            Back
          </Button>
          <Button
            size="lg"
            ml="xs"
            mr="xl"
            disabled={
              (steps.indexOf(step) === 0 &&
                Object.keys(pickedRecipeLinks).length === 0) ||
              steps.indexOf(step) === steps.length - 1
            }
            onClick={() => setStep(steps[steps.indexOf(step) + 1])}
          >
            Next
          </Button>
          <Config
            {...{
              pageRoot: pageRootRef,
              recipeSubstringsDenyList,
              setRecipeSubstringsDenyList,
              removeSubstrings,
              setRemoveSubstrings,
              orderSubstrings,
              setOrderSubstrings,
            }}
          />
        </div>
      </div>

      {step === "pick-recipes" && (
        <RecipeSelector
          {...{
            recipeListData,
            pickedRecipeLinks,
            setPickedRecipeLinks,
            submitButtonRef,
            submitUrls,
          }}
        />
      )}

      {step === "order-grocery-list" && (
        <DndProvider backend={HTML5Backend}>
          <GroceryListContainer
            cards={groceryListItems}
            setCards={setGroceryListItems}
            confirmButtonRef={confirmListButtonRef}
          />
        </DndProvider>
      )}

      {step === "export" && (
        <div>
          {copiedToClipboard && <h3>Copied to clipboard!</h3>}

          <div ref={markdownTextAreaRef} className={style.markdownTextArea}>
            <textarea readOnly value={responseMarkdown} rows={100} cols={100} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

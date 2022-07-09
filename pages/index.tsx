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
import {
  AppShell,
  Button,
  Grid,
  Group,
  Header,
  SegmentedControl,
  Title,
} from "@mantine/core";
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
  title: {
    margin: "0",
    lineHeight: "1.15",
    fontSize: "4rem",
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
  const [showingMarkdown, setShowingMarkdown] = useState(false);

  const [recipeSubstringsDenyList, setRecipeSubstringsDenyList] = useState([]);
  const [removeSubstrings, setRemoveSubstrings] = useState([]);
  const [orderSubstrings, setOrderSubstrings] = useState([]);

  const submitButtonRef = useRef(null);
  const confirmListButtonRef = useRef(null);
  const showMarkdownButtonRef = useRef(null);
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
      console.log("fetchSettings");
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
    console.log("submitUrls");

    setResponseMarkdown("");
    const recipeData = await axios.post("/api/recipes", {
      urlInfo: Object.keys(pickedRecipeLinks).map((recipeLink) => ({
        source: "goodfood",
        url: recipeLink,
      })),
    });

    console.log("setting recipe data:");
    console.log(recipeData);
    setRecipeData(recipeData);

    const groceryListItems = recipePrinter.getGroceryList(
      recipeData.data,
      removeSubstrings,
      orderSubstrings
    );
    console.log("grocery list item response:");
    console.log(groceryListItems);
    console.log("setting grocery list items");
    console.log(
      groceryListItems.map((groceryListItem, index) => ({
        id: index,
        text: groceryListItem,
      }))
    );
    setGroceryListItems(
      groceryListItems.map((groceryListItem, index) => ({
        id: index,
        text: groceryListItem,
      }))
    );
  };

  const parseRecipesPage = async () => {
    console.log("parseRecipePages");
    const recipeListData: any = await axios.get("/api/recipes", {
      params: {
        recipeSources: "goodfood",
        recipeSubstringsDenyList: recipeSubstringsDenyList.join(","),
      },
    });
    setRecipeListData(recipeListData.data.goodfood);
  };

  const showMarkdownPressed = async () => {
    setShowingMarkdown(true);
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

    navigator.clipboard.writeText(newResponseMarkdown);
  };

  return (
    <div ref={pageRootRef}>
      <Head>
        <title className={style.title}>Food Scraper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppShell
        header={
          <Header height={80}>
            <Grid p={10}>
              <Grid.Col span={3}>
                <Group mx="xs">
                  <Image src="/burger-flat.svg" width="32" height="32" />
                  <Title>Food Scraper</Title>
                </Group>
              </Grid.Col>
              <Grid.Col span={5}>
                <SegmentedControl
                  color="green"
                  size="lg"
                  value={step}
                  onChange={setStep}
                  data={[
                    {
                      value: "pick-recipes",
                      label: `Pick Recipes ${`(${
                        Object.keys(pickedRecipeLinks).length
                      })`}`,
                    },
                    {
                      value: "order-grocery-list",
                      label: "Order Grocery List",
                    },
                    { value: "export", label: "Export" },
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Button
                  size="lg"
                  mx="xl"
                  disabled={
                    (steps.indexOf(step) === 0 &&
                      Object.keys(pickedRecipeLinks).length === 0) ||
                    steps.indexOf(step) === steps.length - 1
                  }
                  onClick={() => setStep(steps[steps.indexOf(step) + 1])}
                >
                  Next
                </Button>
              </Grid.Col>
              <Grid.Col span={1}>
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
              </Grid.Col>
            </Grid>
          </Header>
        }
      >
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
            {responseMarkdown && <h3>Copied to clipboard!</h3>}
            {responseMarkdown && (
              <button
                ref={showMarkdownButtonRef}
                className={style.button}
                onClick={() => showMarkdownPressed()}
              >
                Show markdown
              </button>
            )}

            {showingMarkdown && (
              <div ref={markdownTextAreaRef} className={style.markdownTextArea}>
                <textarea
                  readOnly
                  value={responseMarkdown}
                  rows={100}
                  cols={100}
                />
              </div>
            )}
          </div>
        )}
      </AppShell>
    </div>
  );
};

export default Home;

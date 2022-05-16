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
import { Container } from "../components/Container";

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

const Home = () => {
  const style = useStyles();

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
  const markdownTextAreaRef = useRef(null);

  const [groceryListItems, setGroceryListItems] = useState([]);

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

      if (response.data.recipeSubstringsDenyList) {
        setRecipeSubstringsDenyList(response.data.recipeSubstringsDenyList);
      }

      if (response.data.removeSubstrings) {
        setRemoveSubstrings(response.data.removeSubstrings);
      }

      if (response.data.orderSubstrings) {
        setOrderSubstrings(response.data.orderSubstrings);
      }
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

    const today = new Date();
    const dateString = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    const newResponseMarkdown = recipePrinter.getMarkdownPageContent(
      recipeData.data,
      dateString,
      removeSubstrings,
      orderSubstrings
    );
    setResponseMarkdown(newResponseMarkdown);

    submitButtonRef.current.scrollIntoView();
    navigator.clipboard.writeText(newResponseMarkdown);
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

  const showMarkdownPressed = async () => {
    setShowingMarkdown(true);
  };

  useEffect(() => {
    if (showingMarkdown) {
      markdownTextAreaRef.current.scrollIntoView();
    }
  }, [showingMarkdown]);

  const pageRootRef = useRef(null);

  // const sampleCardsData = ["3 tomatoes", "garlic", "2 chicken breasts"];

  return (
    <div className={style.container} ref={pageRootRef}>
      <Head>
        <title className={style.title}>Food Scraper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={style.main}>
        <h1>Food Scraper</h1>
        <div>
          <h1>Test area</h1>
          <DndProvider backend={HTML5Backend}>
            <Container
              cards={groceryListItems}
              setCards={setGroceryListItems}
            />
          </DndProvider>

          <h1>End test area</h1>
        </div>
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

        <RecipeSelector
          {...{
            recipeListData,
            pickedRecipeLinks,
            setPickedRecipeLinks,
            submitButtonRef,
            submitUrls,
          }}
        />

        {responseMarkdown && <h3>Copied to clipboard!</h3>}

        {responseMarkdown && (
          <button
            className={style.button}
            onClick={() => showMarkdownPressed()}
          >
            Show markdown
          </button>
        )}

        {showingMarkdown && (
          <div ref={markdownTextAreaRef} className={style.markdownTextArea}>
            <textarea readOnly value={responseMarkdown} rows={100} cols={100} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import recipePrinter from "../utils/goodfoodRecipePrinter";
import { GoodfoodRecipeListItem, SettingsData } from "../utils/types";
import Config from "../components/Config";

const Home = () => {
  const [responseMarkdown, setResponseMarkdown] = useState("");
  const [recipeListData, setRecipeListData] = useState<
    GoodfoodRecipeListItem[]
  >([]);
  const [pickedRecipeLinks, setPickedRecipeLinks] = useState<string[]>([]);
  const [showingMarkdown, setShowingMarkdown] = useState(false);

  const [removeSubstrings, setRemoveSubstrings] = useState([]);
  const [orderSubstrings, setOrderSubstrings] = useState([]);

  const submitButtonRef = useRef(null);
  const markdownTextAreaRef = useRef(null);

  useEffect(() => {
    parseRecipesPage();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await axios.get<SettingsData>("/api/settings");

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
      recipeUrls: pickedRecipeLinks,
    });

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
    const recipeListData: any = await axios.get("/api/recipes");
    setRecipeListData(recipeListData.data);
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

  return (
    <div className={styles.container} ref={pageRootRef}>
      <Head>
        <title>Goodfood Scraper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Goodfood Scraper</h1>

        <Config
          pageRoot={pageRootRef}
          removeSubstrings={removeSubstrings}
          setRemoveSubstrings={setRemoveSubstrings}
          orderSubstrings={orderSubstrings}
          setOrderSubstrings={setOrderSubstrings}
        />

        <p className={styles.pickedAmountLabel}>
          Picked <b>{pickedRecipeLinks.length}</b> recipes.
        </p>
        <div className={styles.recipeListContainer}>
          {recipeListData.map((recipeData, index) => (
            <div key={index} className={styles.recipeListItem}>
              <a href={recipeData.link} target="_blank" rel="noreferrer">
                <img
                  src={recipeData.image}
                  className={styles.recipeListItemImage}
                />
              </a>
              <div className={styles.recipeListItemTitles}>
                <div style={{}}>
                  <h3 className={styles.marginSmall}>{recipeData.title}</h3>
                  <h4 className={styles.marginSmall}>{recipeData.detail}</h4>
                </div>
                <button
                  className={
                    pickedRecipeLinks.includes(recipeData.link)
                      ? styles.recipeListItemButtonPicked
                      : styles.recipeListItemButtonUnpicked
                  }
                  onClick={() => {
                    const indexOfPickedLink = pickedRecipeLinks.indexOf(
                      recipeData.link
                    );
                    if (indexOfPickedLink == -1) {
                      setPickedRecipeLinks(
                        pickedRecipeLinks.concat(recipeData.link)
                      );
                    } else {
                      setPickedRecipeLinks(
                        pickedRecipeLinks.splice(
                          indexOfPickedLink,
                          indexOfPickedLink
                        )
                      );
                    }
                  }}
                >
                  {pickedRecipeLinks.includes(recipeData.link)
                    ? "Picked"
                    : "Pick me"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          ref={submitButtonRef}
          className={styles.button}
          onClick={() => submitUrls()}
        >
          Submit
        </button>

        {responseMarkdown && <h3>Copied to clipboard!</h3>}

        {responseMarkdown && (
          <button
            className={styles.button}
            onClick={() => showMarkdownPressed()}
          >
            Show markdown
          </button>
        )}

        {showingMarkdown && (
          <div ref={markdownTextAreaRef} style={{ border: "1px solid black" }}>
            <textarea readOnly value={responseMarkdown} rows={100} cols={100} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

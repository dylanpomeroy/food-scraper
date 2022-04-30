import React, { useEffect, useState } from "react";
import GearIcon from "../public/settings-gear.svg";
import Modal from "react-modal";
import { SettingsData } from "../utils/types";
import axios from "axios";

interface Props {
  pageRoot: any;
  recipeSubstringsDenyList: string[];
  removeSubstrings: string[];
  orderSubstrings: string[];
  setRecipeSubstringsDenyList: (recipeSubstringsDenyList: string[]) => void;
  setRemoveSubstrings: (removeSubstrings: string[]) => void;
  setOrderSubstrings: (orderSubstrings: string[]) => void;
}

const Config = ({
  pageRoot,
  recipeSubstringsDenyList,
  setRecipeSubstringsDenyList,
  removeSubstrings,
  setRemoveSubstrings,
  orderSubstrings,
  setOrderSubstrings,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [recipeSubstringsDenyListText, setRecipeSubstringsDenyListText] =
    useState(recipeSubstringsDenyList.join("\n"));

  const [removeSubstringsText, setRemoveSubstringsText] = useState(
    removeSubstrings.join("\n")
  );
  const [orderSubstringsText, setOrderSubstringsText] = useState(
    orderSubstrings.join("\n")
  );

  const saveSettings = async () => {
    setRecipeSubstringsDenyList(recipeSubstringsDenyListText.split("\n"));
    setRemoveSubstrings(removeSubstringsText.split("\n"));
    setOrderSubstrings(orderSubstringsText.split("\n"));

    const settingsObject: SettingsData = {
      recipeSubstringsDenyList:
        recipeSubstringsDenyListText?.split("\n").filter((value) => !!value) ??
        [],
      removeSubstrings:
        removeSubstringsText?.split("\n").filter((value) => !!value) ?? [],
      orderSubstrings:
        orderSubstringsText?.split("\n").filter((value) => !!value) ?? [],
    };

    await axios.post("/api/settings", settingsObject);
  };

  useEffect(() => {
    setRecipeSubstringsDenyListText(recipeSubstringsDenyList.join("\n"));
    setRemoveSubstringsText(removeSubstrings.join("\n"));
    setOrderSubstringsText(orderSubstrings.join("\n"));
  }, [recipeSubstringsDenyList, removeSubstrings, orderSubstrings]);

  return (
    <span>
      <Modal isOpen={isModalOpen} appElement={pageRoot.current}>
        <h2>Settings</h2>

        <h3>Recipe substrings deny list</h3>
        <p>
          Enter substring values for recipes you do not want to see in the
          recipes list. For example, if you cant eat steak or fish, enter the
          values &quot;steak&quot;, &quot;salmon&quot; and &quot;cod&quot; on
          separate lines.
        </p>
        <textarea
          value={recipeSubstringsDenyListText}
          onChange={(event) =>
            setRecipeSubstringsDenyListText(event.target.value)
          }
          style={{
            display: "block",
            height: "200px",
          }}
        />

        <h3>Remove substrings</h3>
        <p>
          Any ingredient that contains a string you enter here will be excluded
          from the grocery list. Use this to exclude ingredients you will not
          need to buy (for example: rice, if you have a big bag at home).
        </p>
        <p>Enter one value on each line.</p>
        <textarea
          value={removeSubstringsText}
          onChange={(event) => setRemoveSubstringsText(event.target.value)}
          style={{
            display: "block",
            height: "200px",
          }}
        />

        <h3>Order substrings</h3>
        <p>
          Use this list to determine the sort order of the ingredients in your
          grocery list. This is helpful for grouping and ordering items as they
          appear in your grocery store, and saves you from having to sort them
          manually.
        </p>
        <p>
          For example, if you start at produce, then the meat section, then the
          aisles, you may want something like:
        </p>
        <ul>
          <li>lime</li>
          <li>carrot</li>
          <li>chicken</li>
          <li>pasta</li>
          <li>tomato paste</li>
        </ul>
        <p>Enter one value on each line.</p>
        <textarea
          value={orderSubstringsText}
          onChange={(event) => setOrderSubstringsText(event.target.value)}
          style={{
            display: "block",
            height: "200px",
          }}
        />

        <button
          onClick={() => {
            setIsModalOpen(false);
            saveSettings();
          }}
        >
          Save &amp; Close
        </button>
      </Modal>
      <button
        style={{
          width: "80px",
          position: "absolute",
          right: "16px",
          top: "24px",
          background: "white",
          border: "0px",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <GearIcon />
      </button>
    </span>
  );
};

export default Config;

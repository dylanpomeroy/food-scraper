import { Low, JSONFile } from "lowdb";
import { SettingsData } from "./types";

const adapter = new JSONFile<SettingsData>("db/settingsDb.json");
const db = new Low<SettingsData>(adapter);

const initialized = false;
const init = async () => {
  if (initialized) return;

  await db.read();
  db.data ||= {
    recipeSubstringsDenyList: [],
    removeSubstrings: [],
    orderSubstrings: [],
  };
};

export const saveSettings = async (settings: SettingsData) => {
  if (!initialized) {
    await init();
  }

  db.data = settings;
  await db.write();
};

export const getSettings = async (): Promise<SettingsData> => {
  if (!initialized) {
    await init();
  }

  return db.data;
};

init();

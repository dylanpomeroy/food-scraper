import { NextApiRequest, NextApiResponse } from "next";
import { getSettings, saveSettings } from "../../utils/databaseConnector";
import { SettingsData } from "../../utils/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    const settings = await getSettings();

    return res.send(settings);
  } else if (req.method == "POST") {
    const settingsData = req.body as SettingsData;
    await saveSettings(settingsData);

    return res.send(201);
  } else {
    return res.send(404);
  }
};

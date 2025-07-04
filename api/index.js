import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import notion from "../lib/notionClient.js";

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { action, title, pageId, contentBlocks } = req.body;

  try {
    if (action === "createTemplate") {
      const response = await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: title } }] }
        },
        children: contentBlocks?.map(block => ({
          object: "block",
          type: block.type,
          [block.type]: {
            text: [{ type: "text", text: { content: block.text } }]
          }
        }))
      });

      return res.json({ success: true, pageUrl: response.url });
    }

    if (action === "updateTemplate") {
      // placeholder — can implement block updates
      return res.json({ message: "Update logic coming soon." });
    }

    if (action === "generateWorkspaceStructure") {
      // Create multiple linked pages or databases
      return res.json({ message: "Workspace generator coming soon." });
    }

    res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

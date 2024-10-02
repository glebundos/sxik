import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

const notesFilePath = path.join(process.cwd(), "data", "notes.json");

async function readNotes() {
  try {
    const data = await fs.readFile(notesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function writeNotes(notes: { name: string; message: string }[]) {
  await fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), "utf-8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const notes = await readNotes();
    res.status(200).json(notes);
  } else if (req.method === "POST") {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }

    const notes = await readNotes();

    const newNote = { name, message };
    notes.push(newNote);

    await writeNotes(notes);

    res.status(201).json(newNote);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

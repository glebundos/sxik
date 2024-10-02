import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

// Определяем путь к файлу с заметками
const notesFilePath = path.join(process.cwd(), "data", "notes.json");

// Функция для чтения заметок из файла
async function readNotes() {
  try {
    const data = await fs.readFile(notesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Если файл не найден, возвращаем пустой массив
    return [];
  }
}

// Функция для записи заметок в файл
async function writeNotes(notes: { name: string; message: string }[]) {
  await fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2), "utf-8");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Возвращаем заметки при GET запросе
    const notes = await readNotes();
    res.status(200).json(notes);
  } else if (req.method === "POST") {
    // Получаем данные из тела запроса
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }

    // Читаем текущие заметки
    const notes = await readNotes();

    // Добавляем новую заметку
    const newNote = { name, message };
    notes.push(newNote);

    // Записываем обновленный массив заметок
    await writeNotes(notes);

    res.status(201).json(newNote);
  } else {
    // Если запрос не GET или POST, возвращаем ошибку 405
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

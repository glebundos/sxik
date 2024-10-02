import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const notesFilePath = path.join(process.cwd(), "data", "notes.json");

export async function GET() {
  try {
    const data = fs.readFileSync(notesFilePath, "utf8");
    const notes = JSON.parse(data);
    return NextResponse.json(notes);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { name, message } = await request.json();

  try {
    const data = fs.readFileSync(notesFilePath, "utf8");
    const notes = JSON.parse(data);

    // Создаем новую заметку с текущей датой и временем
    const newNote = {
      name,
      message,
      date: new Date().toISOString(), // или new Date().toString() для читаемого формата
    };

    notes.push(newNote);
    // fs.writeFileSync(notesFilePath, JSON.stringify(notes));

    // Возвращаем добавленную заметку вместе с сообщением
    return NextResponse.json(
      { message: "Note saved!", note: newNote },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

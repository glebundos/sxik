import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  orderBy,
  query,
} from "firebase/firestore";

export async function GET() {
  try {
    const notesCollection = collection(db, "notes");
    const notesQuery = query(notesCollection, orderBy("date", "asc"));
    const notesSnapshot = await getDocs(notesQuery);
    const notes = notesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toMillis(), // Преобразуем Timestamp в миллисекунды
    }));
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { name, message } = await request.json();

  try {
    const notesCollection = collection(db, "notes");
    const newNote = { name, message, date: Timestamp.now() }; // Используем Timestamp
    const docRef = await addDoc(notesCollection, newNote);

    // Возвращаем новую заметку с датой в миллисекундах
    return NextResponse.json(
      { id: docRef.id, ...newNote, date: newNote.date.toMillis() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.error();
  }
}

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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const imageFile = formData.get("image") as File;

  try {
    const notesCollection = collection(db, "notes");
    const newNote = { name, message, date: Timestamp.now() }; // Используем Timestamp

    let imageUrl = "";
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `${imageFile.name}`);

      await uploadBytes(storageRef, imageFile); // Загружаем файл в Storage

      imageUrl = await getDownloadURL(storageRef); // Получаем URL загруженного изображения
      console.log(imageUrl);
    }

    const docRef = await addDoc(notesCollection, { ...newNote, imageUrl }); // Сохраняем заметку с URL изображения

    // Возвращаем новую заметку с датой в миллисекундах
    return NextResponse.json(
      { id: docRef.id, ...newNote, date: newNote.date.toMillis(), imageUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.error();
  }
}

"use client";

import { useState, useEffect } from "react";
import s from "./styles.module.scss";

export default function NotesForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<
    { id: string; name: string; message: string; date: number }[] // Измените тип на number
  >([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newNote = { name, message };

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (res.ok) {
        const note = await res.json();
        setNotes((prevNotes) => [...prevNotes, note]);
        setName("");
        setMessage("");
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Error submitting note:", error);
    }
  };

  return (
    <div className={s.content}>
      <form onSubmit={handleSubmit} className={s.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите ваше имя"
          required
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение"
          required
        ></textarea>
        <button type="submit">Сохранить</button>
      </form>

      <div className={s.notes}>
        <h2>Сохраненные заметки</h2>
        {notes
          .slice()
          .reverse() // Переворачиваем массив, чтобы новые заметки отображались вверху
          .map((note) => (
            <div key={note.id} className={s.note}>
              <strong>{note.name}:</strong>
              <p>{note.message}</p>
              <small>{new Date(note.date).toLocaleString()}</small>{" "}
            </div>
          ))}
      </div>
    </div>
  );
}

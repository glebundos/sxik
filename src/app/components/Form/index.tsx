"use client";

import { useState, useEffect } from "react";
import s from "./styles.module.scss";

export default function NotesForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<
    { name: string; message: string; date: string }[]
  >([]);

  useEffect(() => {
    // Получение сохраненных заметок при загрузке компонента
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newNote = { name, message };

    try {
      // Отправляем POST запрос на API для сохранения заметки
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (res.ok) {
        const { note } = await res.json(); // Получаем добавленную заметку из ответа
        // Обновляем состояние и очищаем поля формы
        setNotes((prevNotes) => [...prevNotes, note]); // Добавляем новую заметку в начало массива
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
          .map((note, index) => (
            <div key={index} className={s.note}>
              <strong>{note.name}:</strong>
              <p>{note.message}</p>
              <small>{new Date(note.date).toLocaleString()}</small>{" "}
            </div>
          ))
          .reverse()}{" "}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import s from "./styles.module.scss";
import Image from "next/image";

export default function NotesForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState<
    {
      id: string;
      name: string;
      message: string;
      date: number;
      imageUrl: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("next public", process.env.NEXT_PUBLIC_PASSWORD);
    console.log("no next public", process.env.PASSWORD);
    console.log("pass", password);
    if (password !== process.env.NEXT_PUBLIC_PASSWORD) {
      setPassword("");
      return;
    }

    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const note = await res.json();
        setNotes((prevNotes) => [...prevNotes, note]);
        setName("");
        setMessage("");
        setImage(null);
        setImagePreview(null);
      } else {
        console.error("Failed to save note");
      }
    } catch (error) {
      console.error("Error submitting note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <div className={s.lds_dual_ring}></div> : <></>}
      <div className={`${s.content} ${isLoading ? s.blur : ""}`}>
        <form onSubmit={handleSubmit} className={s.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение"
            required
          ></textarea>
          <label htmlFor="file-upload" className={s.custom_file_upload}>
            <Image
              src="/add_photo.svg"
              alt="add-photo"
              width={40}
              height={40}
            />
            {imagePreview && (
              <div className={s.preview}>
                <Image src={imagePreview} alt="Preview" fill={true} />
              </div>
            )}
          </label>
          <input
            id="file-upload"
            className={s.image_input}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit">Сохранить</button>
        </form>

        <div className={s.notes}>
          <h2>Сохранёнки</h2>
          {notes
            .slice()
            .reverse()
            .map((note) => (
              <div key={note.id} className={s.note}>
                <strong>{note.name}:</strong>
                <p>{note.message}</p>
                {note.imageUrl && (
                  <img src={note.imageUrl} alt="Uploaded" />
                )}{" "}
                <small>{new Date(note.date).toLocaleString()}</small>{" "}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

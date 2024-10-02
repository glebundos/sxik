import s from "./page.module.scss";
import Stars from "./components/Stars";
import Header from "./components/Header";
import Form from "./components/Form";

export default function Home() {
  return (
    <div className={s.page}>
      <Stars />
      <Header />
      <Form />
    </div>
  );
}

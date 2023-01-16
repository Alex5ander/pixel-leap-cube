import Head from 'next/head';
import { FormEventHandler } from 'react';
import styles from './index.module.css';

export default function SendScore() {
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name');
    const score = 0;
    console.log(name);
    return;
    try {
      const response = await fetch(
        '/api/addscore?name=' + name + '&score=' + score
      );
    } catch (error) {}
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Save your score</title>
      </Head>
      <form onSubmit={onSubmit}>
        <input placeholder="name" type="text" name="name" />
        <input type="submit" value="send score" />
      </form>
    </div>
  );
}

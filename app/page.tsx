import Link from "next/link";

const Home = () => {
  return (
    <main>
      <h1>Hello APSignals</h1>
      {/* <Link href="/about">About</Link> */}

      <Link href="/signup">signup</Link>
      <br />
      <Link href="/login">login</Link>
    </main>
  );
};
export default Home;

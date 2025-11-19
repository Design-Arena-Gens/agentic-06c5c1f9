import dynamic from "next/dynamic";

const SceneCanvas = dynamic(() => import("../components/SceneCanvas"), {
  ssr: false
});

export default function Page() {
  return (
    <main>
      <SceneCanvas />
      <div className="overlay">
        <h1>Serenity at Fajr</h1>
        <p>
          A tranquil moment of dawn prayer as the first light of day warms the
          desert horizon.
        </p>
      </div>
    </main>
  );
}

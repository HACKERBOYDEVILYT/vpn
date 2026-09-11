import "./index.css";
export default function App() {
  return (
    <main className="app">
      <section className="card">
        <div className="logo">N</div>
        <h1>NexaVPN</h1>
        <p>
          Secure. Private. Fast.
        </p>
        <button type="button">
          Get Started
        </button>
        <div className="status">
          <span className="dot" />
          VPN service ready
        </div>
      </section>
    </main>
  );
}

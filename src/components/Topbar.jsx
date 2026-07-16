export default function Topbar() {
  const user = JSON.parse(
    localStorage.getItem("user") ||
      "{}"
  );

  return (
    <header className="topbar">
      <div>
        <h2>
          Green Energy Marketplace
        </h2>

        <p>
          Peer-to-Peer Renewable Energy Trading
        </p>
      </div>
    </header>
  );
}
function Dashboard() {
  const username = "nasim";

  return (
    <div>
      <h1>JobFlow Dashboard</h1>

      <h2>Welcome, {username} 👋</h2>

      <div>
        <h3>Total Jobs</h3>
        <p>0</p>
      </div>

      <div>
        <h3>Processing</h3>
        <p>0</p>
      </div>

      <div>
        <h3>Successful</h3>
        <p>0</p>
      </div>

      <div>
        <h3>Failed</h3>
        <p>0</p>
      </div>
    </div>
  );
}

export default Dashboard;
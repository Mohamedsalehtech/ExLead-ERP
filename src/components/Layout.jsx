
export default function Layout({ children }) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#0B1020",
          color: "white",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "280px",
            background: "#0A0F1C",
            padding: "20px",
            borderRight: "1px solid #1e293b",
          }}
        >
          <img
  src="/logo.png"
  alt="ExLead Logo"
  className="sidebar-logo"
/>
  
          <div style={{ marginTop: "40px" }}>
            <p>🏠 Dashboard</p>
            <p>👥 Employees</p>
            <p>🏢 Departments</p>
            <p>💰 Revenues</p>
            <p>💸 Expenses</p>
            <p>📊 Payroll</p>
            <p>📈 Reports</p>
            <p>⚙️ Settings</p>
          </div>
        </div>
  
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: "70px",
              background: "#111827",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              borderBottom: "1px solid #1e293b",
            }}
          >
            Dashboard
          </div>
  
          <div style={{ padding: "20px" }}>
            {children}
          </div>
        </div>
      </div>
    );
  }
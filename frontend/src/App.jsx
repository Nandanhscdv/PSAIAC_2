import { useState, useEffect} from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const [ticketData, setTicketData] = useState({
    title: "",
    description: "",
    attachment: null,
  });

  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  useEffect(() => {
  if (activePage !== "tickets" && activePage !== "dashboard") {
  return;
}

  const loadTickets = async () => {
    setTicketsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/tickets");

      if (!response.ok) {
        throw new Error(`Failed to load tickets: ${response.status}`);
      }

      const data = await response.json();

      setTickets(data);
    } catch (error) {
      console.error("Ticket loading error:", error);
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  };

  loadTickets();
}, [activePage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setTicketData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setTicketData((previous) => ({
      ...previous,
      attachment: event.target.files[0],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ticketData.title.trim() || !ticketData.description.trim()) {
        return;
    }

    setIsAnalyzing(true);
    setPredictionError("");
    setPrediction(null);

    try {
        const ticketText = `${ticketData.title}\n${ticketData.description}`;

        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ticket_text: ticketText,
            }),
        });

        if (!response.ok) {
            throw new Error(`Prediction failed: ${response.status}`);
        }

        const data = await response.json();

        setPrediction(data);

        setTicketSubmitted(true);
        setActivePage("result");
    } catch (error) {
        console.error("Prediction error:", error);
        setPredictionError(
            "Unable to analyze the ticket. Please make sure the backend is running."
        );
    } finally {
        setIsAnalyzing(false);
    }
};

  const goToCreateTicket = () => {
    setTicketSubmitted(false);
    setTicketData({
      title: "",
      description: "",
      attachment: null,
    });
    setActivePage("create");
  };

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">IT</div>

          <div>
            <h2>IT Support</h2>
            <span>Smart Helpdesk</span>
          </div>
        </div>

        <nav className="navigation">

          <button
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={
              activePage === "create"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={goToCreateTicket}
          >
            <span>＋</span>
            Raise Ticket
          </button>

          <button
            className={
              activePage === "tickets"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("tickets")}
          >
            <span>▣</span>
            My Tickets
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div>
            <h1>
              {activePage === "dashboard" && "Dashboard"}
              {activePage === "create" && "Raise a Ticket"}
              {activePage === "result" && "Ticket Analysis"}
              {activePage === "tickets" && "My Tickets"}
            </h1>

            <p>
              {activePage === "dashboard" &&
                "Welcome back. How can we help you today?"}

              {activePage === "create" &&
                "Tell us what you're experiencing."}

              {activePage === "result" &&
                "Your ticket has been analyzed by our intelligent triage system."}

              {activePage === "tickets" &&
                "View and track your support requests."}
            </p>
          </div>

          <div className="profile">

            <div className="notification">
              🔔
            </div>

            <div className="avatar">
              N
            </div>

            <div className="profile-info">
              <strong>Nandan</strong>
              <span>Employee</span>
            </div>

          </div>

        </header>


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activePage === "dashboard" && (

          <section className="dashboard">

            <div className="welcome-card">

              <div>

                <span className="small-label">
                  INTELLIGENT IT SUPPORT
                </span>

                <h2>
                  Submit an IT issue.
                  <br />
                  We'll route it to the right team.
                </h2>

                <p>
                  Describe your problem in your own words.
                  Our intelligent triage system will analyze
                  the ticket, determine its priority, and route
                  it to the appropriate support team.
                </p>

                <button
                  className="primary-button"
                  onClick={goToCreateTicket}
                >
                  + Raise a Ticket
                </button>

              </div>



            </div>


            {/* STATISTICS */}

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon blue">
                  🎫
                </div>

                <div>
                  <span>My Tickets</span>
                  <strong>{tickets.length}</strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon orange">
                  ◷
                </div>

                <div>
                  <span>Open Tickets</span>
                  <strong>{tickets.length}</strong>
                </div>

              </div>


              <div className="stat-card">

                <div className="stat-icon green">
                  ✓
                </div>

                <div>
                  <span>Resolved</span>
                  <strong>0</strong>
                </div>

              </div>

            </div>


            {/* RECENT TICKETS */}

            <div className="section-header">

              <div>

                <h2>
                  Recent Tickets
                </h2>

                <p>
                  Your latest support requests
                </p>

              </div>

              <button
                className="view-all"
                onClick={() => setActivePage("tickets")}
              >
                View all →
              </button>

            </div>


            <div className="ticket-table">

              <div className="table-header">

                <span>Ticket</span>
                <span>Issue</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Updated</span>

              </div>

            {ticketsLoading ? (
  <div className="table-row">
    <span>Loading...</span>
    <span>Loading tickets...</span>
    <span>-</span>
    <span>-</span>
    <span>-</span>
  </div>
) : tickets.length === 0 ? (
  <div className="table-row">
    <span>-</span>
    <span>
      <strong>No tickets found</strong>
      <small>Raise a ticket to get started.</small>
    </span>
    <span>-</span>
    <span>-</span>
    <span>-</span>
  </div>
) : (
  tickets.slice(0, 5).map((ticket) => {
    const priority = ticket.predicted_priority || "Unknown";
    const priorityClass = priority.toLowerCase();

    const issueText = ticket.ticket_text || "No description";

    const firstLine = issueText.split("\n")[0];
    const secondLine = issueText.split("\n").slice(1).join(" ");

    return (
      <div className="table-row" key={ticket.id}>

        <span className="ticket-id">
          #{ticket.id}
        </span>

        <span>
          <strong>
            {firstLine}
          </strong>

          <small>
            {secondLine || "IT Support Ticket"}
          </small>
        </span>

        <span>
          <span className={`priority ${priorityClass}`}>
            {priority}
          </span>
        </span>

        <span>
          <span className="status open">
            Open
          </span>
        </span>

        <span className="date">
          {ticket.created_at
            ? new Date(ticket.created_at).toLocaleString()
            : "-"}
        </span>

      </div>
    );
  })
)}


            </div>

          </section>

        )}


        {/* =====================================================
            CREATE TICKET
        ===================================================== */}

        {activePage === "create" && (

          <section className="create-ticket-page">

            <div className="ticket-form-card">

              <div className="form-heading">

                <div className="form-heading-icon">
                  ✦
                </div>

                <div>
                  <h2>
                    Create Support Ticket
                  </h2>

                  <p>
                    Describe your issue and let our intelligent
                    triage system handle the rest.
                  </p>
                </div>

              </div>


              <form onSubmit={handleSubmit}>

                {/* TITLE */}

                <div className="form-group">

                  <label htmlFor="title">
                    Issue Title
                    <span>*</span>
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Unable to connect to VPN"
                    value={ticketData.title}
                    onChange={handleInputChange}
                    required
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="form-group">

                  <label htmlFor="description">
                    Describe your problem
                    <span>*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    placeholder="Explain what is happening. Include any error messages or useful details..."
                    value={ticketData.description}
                    onChange={handleInputChange}
                    rows="7"
                    required
                  />

                  <small className="field-hint">
                    Tip: The more details you provide, the better
                    our intelligent triage system can understand
                    your issue.
                  </small>

                </div>


                {/* ATTACHMENT */}

                <div className="form-group">

                  <label>
                    Attachment
                    <span className="optional">
                      Optional
                    </span>
                  </label>

                  <label
                    htmlFor="attachment"
                    className="upload-box"
                  >

                    <div className="upload-icon">
                      📎
                    </div>

                    <div>
                      <strong>
                        {ticketData.attachment
                          ? ticketData.attachment.name
                          : "Upload a screenshot or file"}
                      </strong>

                      <small>
                        PNG, JPG or PDF • Maximum 10 MB
                      </small>
                    </div>

                  </label>

                  <input
                    id="attachment"
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    hidden
                  />

                </div>


                {/* AI NOTICE */}

                <div className="ai-notice">

                  <div className="ai-notice-icon">
                    ✦
                  </div>

                  <div>

                    <strong>
                      Intelligent Triage
                    </strong>

                    <p>
                      After submission, the system will analyze
                      your ticket and determine its category,
                      priority, support team, and estimated
                      resolution time.
                    </p>

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="form-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setActivePage("dashboard")}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Submit Ticket →
                  </button>

                </div>

              </form>

            </div>

          </section>

        )}


        {/* =====================================================
            AI RESULT
        ===================================================== */}

        {activePage === "result" && ticketSubmitted && (

          <section className="result-page">

            <div className="success-header">

              <div className="success-icon">
                ✓
              </div>

              <div>
                <h2>
                  Ticket Submitted Successfully
                </h2>

                <p>
                  Ticket <strong>#{prediction?.ticket_id || "—"}</strong> has been
                  received and analyzed.
                </p>
              </div>

            </div>


            <div className="ai-analysis-card">

              <div className="analysis-heading">

                <div className="analysis-ai-icon">
                  ✦
                </div>

                <div>

                  <span>
                    AI TRIAGE ANALYSIS
                  </span>

                  <h2>
                    Intelligent Ticket Assessment
                  </h2>

                </div>

                <div className="confidence">
                  <small>
                    AI Model
                  </small>

                  <strong>
                    Priority Prediction
                  </strong>
                </div>

              </div>


              {/* ORIGINAL TICKET */}

              <div className="submitted-ticket">

                <span>
                  YOUR ISSUE
                </span>

                <h3>
                  {ticketData.title}
                </h3>

                <p>
                  {ticketData.description}
                </p>

              </div>


              {/* AI PREDICTIONS */}

              <div className="prediction-grid">

                <div className="prediction-card">

                  <span>
                    CATEGORY
                  </span>

                  <strong>
                    Not Available
                  </strong>

                  <small>
                    Category prediction not implemented
                  </small>

                </div>


                <div className="prediction-card">

                  <span>
                    PRIORITY
                  </span>

                  <strong className={`prediction-${prediction?.priority?.toLowerCase() || "unknown"}`}>
    {prediction?.priority || "Analyzing..."}
</strong>

                  <small>
                    Predicted urgency
                  </small>

                </div>


                <div className="prediction-card">

                  <span>
                    ASSIGNED TEAM
                  </span>

                  <strong>
                    Not Assigned
                  </strong>

                  <small>
                    Team routing not implemented
                  </small>

                </div>

              </div>


              {/* ETA */}

              <div className="eta-card">

                <div className="eta-icon">
                  ◷
                </div>

                <div>

                  <span>
                    ESTIMATED RESOLUTION TIME
                  </span>

                  <strong>
                    Not Available
                  </strong>

                  <small>
                    Resolution-time prediction not implemented
                  </small>

                </div>

              </div>


              <div className="result-footer">

                <div>
                  <span>Status</span>

                  <strong className="status assigned">
                    Assigned
                  </strong>
                </div>

                <div>
                  <span>Ticket ID</span>

                  <strong>
                    #{prediction?.ticket_id || "—"}
                  </strong>
                </div>

                <div>
                  <span>Created</span>

                  <strong>
                    Just now
                  </strong>
                </div>

              </div>

            </div>


            <div className="result-actions">

              <button
                className="secondary-button"
                onClick={() => setActivePage("dashboard")}
              >
                ← Back to Dashboard
              </button>

              <button
                className="submit-button"
                onClick={goToCreateTicket}
              >
                + Create Another Ticket
              </button>

            </div>

          </section>

        )}


        {/* =====================================================
            MY TICKETS
        ===================================================== */}

        {activePage === "tickets" && (

          <section className="my-tickets-page">

            <div className="tickets-summary">

              <div>
                <h2>
                  My Tickets
                </h2>

                <p>
                  Track all your IT support requests.
                </p>
              </div>

              <button
                className="submit-button"
                onClick={goToCreateTicket}
              >
                + Raise Ticket
              </button>

            </div>


            <div className="ticket-table">

              <div className="table-header">

                <span>Ticket</span>
                <span>Issue</span>
                <span>Priority</span>
                <span>Status</span>
                <span>Updated</span>

              </div>


                          {ticketsLoading ? (
                <div className="table-row">
                  <span>Loading...</span>
                  <span>Loading tickets...</span>
                  <span>-</span>
                  <span>-</span>
                  <span>-</span>
                </div>
              ) : tickets.length === 0 ? (
                <div className="table-row">
                  <span>-</span>
                  <span>
                    <strong>No tickets found</strong>
                    <small>Raise a ticket to get started.</small>
                  </span>
                  <span>-</span>
                  <span>-</span>
                  <span>-</span>
                </div>
              ) : (
                tickets.map((ticket) => {
                  const priority = ticket.predicted_priority || "Unknown";
                  const priorityClass = priority.toLowerCase();

                  const issueText = ticket.ticket_text || "No description";

                  const firstLine = issueText.split("\n")[0];
                  const secondLine = issueText.split("\n").slice(1).join(" ");

                  return (
                    <div className="table-row" key={ticket.id}>

                      <span className="ticket-id">
                        #{ticket.id}
                      </span>

                      <span>
                        <strong>
                          {firstLine}
                        </strong>

                        <small>
                          {secondLine || "IT Support Ticket"}
                        </small>
                      </span>

                      <span>
                        <span className={`priority ${priorityClass}`}>
                          {priority}
                        </span>
                      </span>

                      <span>
                        <span className="status open">
                          Open
                        </span>
                      </span>

                      <span className="date">
                        {ticket.created_at
                          ? new Date(ticket.created_at).toLocaleString()
                          : "-"}
                      </span>

                    </div>
                  );
                })
              )}



            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;

import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";

function TestingTool() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      setOutput(data.output || data.error);
    } catch (error) {
      setOutput("Error executing command");
    }
  };

  return (
    <Container
      style={{
        maxWidth: "500px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        border: "3px solid #e0871a",
        boxShadow: "0 0 25px 0 black",
        padding: "20px",
        marginTop: "50px",
      }}
    >
      <div className="testing-tool-container">
        <h1 className="text-center">Testing Tool</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter command"
            className="form-control"
          />
          <button type="submit" className="btn btn-primary mt-3 w-100">
            Execute
          </button>
        </form>
        <div className="mt-4">
          <h2>Output:</h2>
          <pre className="border p-3">{output}</pre>
        </div>
        <div className="mt-4 text-center">
          <button
            className="btn btn-secondary me-2"
            onClick={() => setCommand("vgs login")}
          >
            Login
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setCommand("vgs logout")}
          >
            Logout
          </button>
        </div>
      </div>
    </Container>
  );
}

export default TestingTool;

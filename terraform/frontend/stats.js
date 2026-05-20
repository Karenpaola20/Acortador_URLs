const API_URL = "https://ixhu0zrdjc.execute-api.us-east-1.amazonaws.com";

async function getStats() {

  const code = document.getElementById("codeInput").value;

  const response = await fetch(`${API_URL}/stats/${code}`);

  const data = await response.json();

  let visitsHtml = "";

  data.visits.forEach(visit => {

    visitsHtml += `<li>${visit}</li>`;
  });

  document.getElementById("statsResult").innerHTML = `

    <h3>Statistics</h3>

    <p>
      <strong>Code:</strong> ${data.code}
    </p>

    <p>
      <strong>Total Clicks:</strong> ${data.totalClicks}
    </p>

    <h4>Visits</h4>

    <ul>
      ${visitsHtml}
    </ul>
  `;
}
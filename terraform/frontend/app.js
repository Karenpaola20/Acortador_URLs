const API_URL = "https://ixhu0zrdjc.execute-api.us-east-1.amazonaws.com";

async function shortenUrl() {

  const url = document.getElementById("urlInput").value;

  const response = await fetch(`${API_URL}/shorten`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      url
    })
  });

  const data = await response.json();

  document.getElementById("result").innerHTML = `

    <p>
      ${data.shortUrl}
    </p>

    <button onclick="copyUrl('${data.shortUrl}')">
      Copy
    </button>
  `;
}

function copyUrl(url) {

  navigator.clipboard.writeText(url);

  alert("Copied!");
}
// El backend sirve el frontend, así que la API está en el mismo origen
const API_URL = window.location.origin;

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

async function copyUrl(url) {

  try {
    await navigator.clipboard.writeText(url);
    alert("Copied!");
  } catch (error) {
    alert("Could not copy the link");
  }
}
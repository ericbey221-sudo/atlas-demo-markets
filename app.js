const marketData = [
  {asset:"BTC/USD", price:109420.25, change:2.41},
  {asset:"ETH/USD", price:4360.18, change:1.17},
  {asset:"XAU/USD", price:3542.80, change:-0.63},
  {asset:"EUR/USD", price:1.1724, change:0.28},
  {asset:"AAPL", price:238.41, change:-0.42}
];

const tx = [
  ["2026-09-05","BUY","BTC/USD","$1,500.00","DEMO"],
  ["2026-09-04","BUY","ETH/USD","$1,000.00","DEMO"],
  ["2026-09-03","BUY","XAU/USD","$1,250.00","DEMO"]
];

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(n);
}

function renderMarkets() {
  document.querySelector("#marketRows").innerHTML = marketData.map(m => `
    <tr>
      <td><b>${m.asset}</b></td>
      <td>${m.price.toLocaleString()}</td>
      <td class="${m.change >= 0 ? "up" : "down"}">
        ${m.change >= 0 ? "+" : ""}${m.change}%
      </td>
      <td>
        <button class="trade-btn" onclick="alert('Demo only: no real order is placed.')">
          Trade Demo
        </button>
      </td>
    </tr>
  `).join("");
}

function renderTx() {
  document.querySelector("#transactionsRows").innerHTML = tx.map(t => `
    <tr>
      ${t.map((x, i) => `
        <td>${i === 4 ? `<span class="eyebrow">${x}</span>` : x}</td>
      `).join("")}
    </tr>
  `).join("");
}

function resetDemo() {
  localStorage.removeItem("demoProfile");
  location.reload();
}

document.querySelector("#accountForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const savedField = document.querySelector("#saved");

  const p = {
    name: nameField.value.trim(),
    email: emailField.value.trim()
  };

  localStorage.setItem("demoProfile", JSON.stringify(p));

  savedField.textContent = `Demo profile saved for ${p.name}.`;
});

const savedProfile = JSON.parse(
  localStorage.getItem("demoProfile") || "null"
);

if (savedProfile) {
  document.querySelector("#name").value = savedProfile.name || "";
  document.querySelector("#email").value = savedProfile.email || "";
  document.querySelector("#saved").textContent =
    `Demo profile loaded for ${savedProfile.name}.`;
}

renderMarkets();
renderTx();

new Chart(document.getElementById("chart"), {
  type: "line",
  data: {
    labels: [
      "Aug 30",
      "Aug 31",
      "Sep 1",
      "Sep 2",
      "Sep 3",
      "Sep 4",
      "Sep 5"
    ],
    datasets: [{
      label: "Demo portfolio",
      data: [9200, 9410, 9550, 9480, 9820, 9950, 10000],
      tension: 0.35
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#c8cbd2"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#8e95a3"
        }
      },
      y: {
        ticks: {
          color: "#8e95a3"
        }
      }
    }
  }
});

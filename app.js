const STARTING_CASH = 6250;
const STARTING_INVESTED = 3750;
const STARTING_PNL = 250;

const marketData = [
  { asset: "BTC/USD", price: 109420.25, change: 2.41 },
  { asset: "ETH/USD", price: 4360.18, change: 1.17 },
  { asset: "XAU/USD", price: 3542.80, change: -0.63 },
  { asset: "EUR/USD", price: 1.1724, change: 0.28 },
  { asset: "AAPL", price: 238.41, change: -0.42 }
];

const startingTransactions = [
  ["2026-09-05", "BUY", "BTC/USD", "$1,500.00", "DEMO"],
  ["2026-09-04", "BUY", "ETH/USD", "$1,000.00", "DEMO"],
  ["2026-09-03", "BUY", "XAU/USD", "$1,250.00", "DEMO"]
];

let demoState = JSON.parse(
  localStorage.getItem("atlasDemoState") || "null"
) || {
  cash: STARTING_CASH,
  invested: STARTING_INVESTED,
  pnl: STARTING_PNL,
  transactions: startingTransactions
};

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function saveState() {
  localStorage.setItem("atlasDemoState", JSON.stringify(demoState));
}

function updateSummary() {
  const balance = demoState.cash + demoState.invested;

  document.querySelector("#balance").textContent = money(balance);
  document.querySelector("#cash").textContent = money(demoState.cash);
  document.querySelector("#invested").textContent = money(demoState.invested);
  document.querySelector("#pnl").textContent =
    (demoState.pnl >= 0 ? "+" : "") + money(demoState.pnl);

  document.querySelector("#positions").textContent =
    demoState.transactions.length;
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
        <button class="trade-btn" onclick="demoTrade('BUY','${m.asset}')">
          Buy Demo
        </button>
        <button class="trade-btn" onclick="demoTrade('SELL','${m.asset}')">
          Sell Demo
        </button>
      </td>
    </tr>
  `).join("");
}

function renderTransactions() {
  document.querySelector("#transactionsRows").innerHTML =
    demoState.transactions.map(t => `
      <tr>
        ${t.map((x, i) => `
          <td>
            ${i === 4 ? `<span class="eyebrow">${x}</span>` : x}
          </td>
        `).join("")}
      </tr>
    `).join("");
}

function demoTrade(type, asset) {
  const amount = 250;

  if (type === "BUY") {
    if (demoState.cash < amount) {
      alert("Demo account has insufficient fictional cash.");
      return;
    }

    demoState.cash -= amount;
    demoState.invested += amount;
  } else {
    if (demoState.invested < amount) {
      alert("Demo account has insufficient fictional invested value.");
      return;
    }

    demoState.cash += amount;
    demoState.invested -= amount;
  }

  const today = new Date().toISOString().slice(0, 10);

  demoState.transactions.unshift([
    today,
    type,
    asset,
    money(amount),
    "DEMO"
  ]);

  saveState();
  updateSummary();
  renderTransactions();

  alert(
    `Demo only: ${type} ${asset} for ${money(amount)}. No real order was placed.`
  );
}

function resetDemo() {
  localStorage.removeItem("atlasDemoState");
  localStorage.removeItem("demoProfile");

  demoState = {
    cash: STARTING_CASH,
    invested: STARTING_INVESTED,
    pnl: STARTING_PNL,
    transactions: startingTransactions.map(row => [...row])
  };

  updateSummary();
  renderTransactions();

  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const savedField = document.querySelector("#saved");

  if (nameField) nameField.value = "";
  if (emailField) emailField.value = "";
  if (savedField) savedField.textContent = "";

  alert("Demo account has been reset to the fictional starting values.");
}

document.querySelector("#accountForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const savedField = document.querySelector("#saved");

  const profile = {
    name: nameField.value.trim(),
    email: emailField.value.trim()
  };

  localStorage.setItem("demoProfile", JSON.stringify(profile));

  savedField.textContent =
    `Demo profile saved for ${profile.name}.`;
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
renderTransactions();
updateSummary();

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

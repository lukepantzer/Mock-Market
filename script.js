// ===== API KEY (THIS MUST BE AT THE VERY TOP) =====
const API_KEY = "d63nie1r01ql6dj0ootgd63nie1r01ql6dj0oou0";

// ===== GLOBAL STATE =====
let balance = 10000;
let portfolio = {};
// portfolio example:
// {
//   AAPL: { shares: 2, totalCost: 350 }
// }
let currentSymbol = null;
let currentPrice = null;

// ===== LOAD STOCK (LIVE PRICE) =====
async function loadStock() {
  try {
    const symbol = document.getElementById("symbol").value.trim().toUpperCase();

    if (!symbol) {
      alert("Type a stock symbol like AAPL");
      return;
    } 

    const url =
      "https://finnhub.io/api/v1/quote?symbol=" +
      symbol +
      "&token=" +
      API_KEY;

    const res = await fetch(url);
    const data = await res.json();

    // Finnhub: c = current price
    if (!data || typeof data.c !== "number" || data.c === 0) {
      alert("No live price returned. Check symbol or API key.");
      return;7
    }

    currentSymbol = symbol;
    currentPrice = data.c;

    document.getElementById("price").textContent =
      "Price: $" + currentPrice.toFixed(2);

    document.getElementById("feedback").textContent =
      "Live price loaded✔";

  } catch (err) {
    console.error("loadStock error:", err);
    alert("Error loading stock. Check console.");
  }
}
// ===== BUY STOCK =====
function buyStock() {
  if (!currentSymbol || !currentPrice) {
    alert("Search for a stock first");
    return;
  } 
  if (balance < currentPrice) {
    alert("Not enough Mock Money to buy this!");
    return;
  }
  balance -= currentPrice;

  if (!portfolio[currentSymbol]) {
    portfolio[currentSymbol] = {
      shares: 0,
      totalCost: 0
    };
  }

  portfolio[currentSymbol].shares += 1;
  portfolio[currentSymbol].totalCost += currentPrice;

  updateUI();
}
// ===== SELL STOCK =====
function sellStock() {
  if (!currentSymbol || !portfolio[currentSymbol]) {
    alert("You don’t own this stock");
    return;
  }

  balance += currentPrice;

  portfolio[currentSymbol].shares -= 1;
  portfolio[currentSymbol].totalCost -=
    portfolio[currentSymbol].totalCost / (portfolio[currentSymbol].shares + 1);

  if (portfolio[currentSymbol].shares === 0) {
    delete portfolio[currentSymbol];
  }

  updateUI();
}
// ===== UPDATE UI =====
function updateUI() {
  document.getElementById("balance").textContent =
    "Balance: $" + balance.toFixed(2);

  const portfolioDiv = document.getElementById("portfolio");
  const totalPLDiv = document.getElementById("totalPL");

  if (Object.keys(portfolio).length === 0) {
    portfolioDiv.innerHTML = "Portfolio: none";
    totalPLDiv.textContent = "Total P/L: $0.00 (0.00%)";
    return;
  }

  let html = "";
  let totalProfit = 0;
  let totalInvested = 0;

  for (let symbol in portfolio) {
    const stock = portfolio[symbol];
    const avgPrice = stock.totalCost / stock.shares;
    const profit = (currentPrice - avgPrice) * stock.shares;
    const percent = (profit / stock.totalCost) * 100;

    totalProfit += profit;
    totalInvested += stock.totalCost;

    const sign = profit >= 0 ? "+" : "";

    html += `
      <div style="margin-bottom: 12px;">
        <strong>${symbol}</strong><br>
        Shares: ${stock.shares}<br>
        Avg Price: $${avgPrice.toFixed(2)}<br>
        P/L: ${sign}$${profit.toFixed(2)} (${sign}${percent.toFixed(2)}%)
      </div>
    `;
  }

  const totalPercent = (totalProfit / totalInvested) * 100;
  const totalSign = totalProfit >= 0 ? "+" : "";

  totalPLDiv.textContent =
    `Total P/L: ${totalSign}$${totalProfit.toFixed(2)} (${totalSign}${totalPercent.toFixed(2)}%)`;

  portfolioDiv.innerHTML = html;
}
// ===== STOCK MARKET CHALLENGES =====
const questions = [
  {
  q: "What hours are the Stock Exchange open?",
    options:  [
      "9:30 am to 4:00 pm",
      "10:45 am to 530 pm",
      "11:00 am to 330 pm"
    ],
    corrct: 0,
    reward: 750 },
  {
    q: "What does a bull market mean?",
    options:  [
      "A market where stocks are rising or are expected to rise",
      "A market where stocks are falling",
      "A low point in the market so you should buy while its low"
    ],
    correct: 0,
    reward: 750 },
  {
      q: "What does owning a stock mean?",
    options: [
      "You own part of a company",
      "You loan money to the government",
      "You get guaranteed profit"
    ],
    correct: 0,
    reward: 750 },
  
  {
    q: "What usually reduces investment risk?",
    options: [
     "Buying one stock",
      "Diversification",
      "Selling at a dip"
    ],
    correct: 1,
    reward: 750 }
  ,
  {
    q: "What is a dividend?",
    options: [
      "A company profit payment",
      "A stock price drop",
      "A trading fee"
    ],
    correct: 0,
    reward: 750
  },
  {
    q: "Long-term investors usually focus on:",
    options: [
      "Daily price changes",
      "Company growth",
      "Market rumors"
    ],
    correct: 1,
    reward: 750
  }
];

let currentQuestion = null;

function newQuestion() {
  const i = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[i];

  document.getElementById("challengeQuestion").textContent =
    currentQuestion.q;

  document.getElementById("opt0").textContent =
    currentQuestion.options[0];
  document.getElementById("opt1").textContent =
    currentQuestion.options[1];
  document.getElementById("opt2").textContent =
    currentQuestion.options[2];

  document.getElementById("challengeResult").textContent = "";
}

function answerQuestion(choice) {
  if (!currentQuestion) return;

  if (choice === currentQuestion.correct) {
    balance += currentQuestion.reward;
    updateUI();

    document.getElementById("challengeResult").textContent =
      `✅ Correct 750$ +$${currentQuestion.reward}`;
  } else {
    document.getElementById("challengeResult").textContent =
      "❌ Incorrect. Try again."; 
  }

  currentQuestion = null;
}
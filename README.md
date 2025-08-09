# 🌾 TanimBuddy

**TanimBuddy** is an AI-powered, SMS-based agricultural advisory system designed to support smallholder Filipino farmers using basic mobile phones. It provides personalized, localized, and timely farming recommendations in native dialects — no smartphone or internet required.

Powered by a lightweight AI engine called **BantayANI** (Artificial Narrow Intelligence), TanimBuddy brings essential farming knowledge straight to the farmer’s inbox via text. It acts as a digital *barangay agri aide* — always available, kind, and practical.

---

## 📦 Repositories

This project is split into two core repositories:

### [`tanimbuddy`](https://github.com/siratimlabs/tanimbuddy)
> Frontend and SMS I/O layer  
Built with **Next.js**, **Express.js**, and **Twilio SDK**

Responsibilities:
- Receive and respond to SMS messages
- Format AI replies for SMS delivery
- Log farmer interactions
- Admin dashboard for monitoring and alerts

---

### [`bantayani`](https://github.com/siratimlabs/bantayani)
> AI + Rules Engine  
Built with **FastAPI** or **Express.js**, depending on language used

Responsibilities:
- Process natural language queries
- Classify intents and apply decision logic
- Fetch weather, crop calendars, and pest alerts
- Localize messages using translation APIs
- Return short, actionable responses

---

## 🚀 Key Features

- 📱 **2-Way SMS Support**  
  Receive and respond to farmer queries via Twilio SMS

- 🌦 **Localized AI Decisions**  
  Combine NLP, rules, and real-time weather data to provide meaningful advice

- 🧠 **Minimal Input, Maximum Clarity**  
  Infer intent from short texts (1–5 words) in native languages

- 🗣 **Multilingual Support**  
  Tagalog, Cebuano, Ilocano (via translation API)

- 🧾 **Admin Dashboard**  
  View farmer interactions, send broadcast alerts

- 💡 **Farmer-Centric Tone**  
  Trustworthy, clear, kind, and always action-oriented

---

## 🛠️ Getting Started

To set up the project locally or in your dev environment, please refer to the [**Getting Started Guide**](https://github.com/siratimlabs/tanimbuddy/wiki/Getting-Started) in the project Wiki.

---

## 🤝 Contributing

We welcome community involvement! To contribute to TanimBuddy, see our [**Contribution Guidelines**](https://github.com/siratimlabs/tanimbuddy/wiki/Contributing) for full instructions on setup, issue tracking, and pull request workflows.

---

## 📄 License

This project is licensed under the MIT License.  
See the full [**LICENSE.md**](./LICENSE.md) for details.

---

## 📫 Contact

For partnerships, field testing, or integration inquiries, please email:  
**siratimlabs@gmail.com**  
Or open an issue on the main repo.

---

## 🌍 Vision

**TanimBuddy** aims to empower millions of farmers through accessible technology — no apps, no intermediaries — just clear advice when it matters most. From seed to harvest, knowledge is now just a text away.
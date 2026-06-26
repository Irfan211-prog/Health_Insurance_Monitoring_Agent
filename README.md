# Autonomous Health Insurance Fraud Investigation Agent

An end-to-end AI-powered multi-agent system that transforms traditional fraud detection into an intelligent fraud investigation platform.

Instead of only predicting whether a claim is fraud or not, this system behaves like a virtual fraud analyst team—detecting, investigating, reasoning, explaining, and generating structured reports in real time.

It combines Machine Learning, multi-agent architecture, and Ollama (Mistral LLM) to simulate a real-world insurance fraud investigation workflow.

---

## Problem Statement

Insurance companies process thousands of claims daily. Traditional fraud detection systems face several limitations:

- Manual investigation delays
- Difficulty in detecting complex fraud patterns
- High financial losses due to late detection
- Lack of explainability in ML-based decisions

### Objective

Build an autonomous AI system that:
- Detects suspicious insurance claims
- Investigates anomalies using historical data
- Explains predictions using LLM reasoning
- Generates structured fraud investigation reports
- Supports decision-making for analysts in real time

---

## What Makes This an AI Agent System

This system is not a standalone classifier. It behaves like a coordinated team of intelligent agents:

- Observes incoming claim data
- Reasons using ML models and business rules
- Investigates anomalies using historical patterns
- Explains decisions in natural language
- Recommends actions (approve, review, escalate)

---

## Multi-Agent Architecture

### Coordinator Agent
Controls the overall workflow and manages communication between all agents.

### Fraud Detection Agent
- Machine learning-based fraud scoring model
- Handles class imbalance using SMOTE / ADASYN
- Outputs fraud probability and risk level

### Investigation Agent
- Detects anomalies in claims
- Identifies patterns such as upcoding, duplicate billing, and abnormal charges
- Compares claims with historical records

### Explanation Agent (Ollama + Mistral)
- Uses Mistral LLM via Ollama
- Converts model output into human-readable explanations
- Improves transparency of predictions

### Recommendation Agent
- Converts risk scores into actionable decisions:
  - Approve
  - Manual review
  - Fraud escalation

### Report Generation Agent
- Generates structured fraud reports including:
  - Claim summary
  - Suspicious indicators
  - Evidence-based reasoning
  - Final recommendation

---

## System Workflow

Incoming Claim
↓
Data Preprocessing
↓
Fraud Detection Agent (ML Model)
↓
Coordinator Agent
↓
Investigation Agent
↓
Explanation Agent (Ollama - Mistral)
↓
Recommendation Agent
↓
Report Generation Agent
↓
Action System (Approve / Flag / Escalate)


---

## Frontend (React UI) - Insight Guardian

The project includes a React-based frontend dashboard located in:
insight-guardian/

This UI serves as the analyst interface for interacting with the fraud investigation system.

### Frontend Features

- Claim submission interface
- Fraud risk score visualization
- AI-generated explanation panel
- Investigation insights dashboard
- Analytics and trend visualization
- Structured report viewer

---

## Frontend Stack

- React (Vite or CRA)
- Axios for API communication
- React Router
- Chart.js or Recharts for visualization
- Tailwind CSS or CSS modules

---

## Frontend–Backend Integration

React UI (Insight Guardian)
↓
API Calls (Axios)
↓
FastAPI / Flask Backend
↓
Fraud Detection + Multi-Agent System
↓
Ollama (Mistral LLM)
↓
JSON Response
↓
React Dashboard Rendering


---

## Tech Stack

### Core ML & Data
- Python
- pandas
- numpy
- scikit-learn
- imbalanced-learn (SMOTE / ADASYN)

### AI / LLM Layer
- Ollama
- Mistral LLM
- Prompt engineering
- Multi-agent orchestration

### Backend
- FastAPI / Flask
- REST APIs
- JSON-based communication

### Frontend
- React
- Axios
- Chart.js / Recharts
- Tailwind CSS

---

## Ollama + Mistral Integration

This project uses Ollama for local LLM inference.

### Setup

ollama run mistral


### Usage

- Generates explanations for fraud predictions
- Converts ML outputs into human-readable reasoning
- Improves interpretability and trust

---

## Example Output

### Fraud Risk Prediction

Risk Score: 0.89 (HIGH RISK)
Action: ESCALATE TO FRAUD INVESTIGATION TEAM


### LLM Explanation

The claim shows unusually high billing for standard procedures.
Similar patterns have been observed in historical fraud cases involving the same provider.
The cost significantly deviates from expected medical benchmarks.


### Generated Report

Claim Summary:
High-value orthopedic treatment claim.

Suspicious Indicators:

Excessive billing for standard procedures
Repeated usage pattern from same hospital
Significant cost deviation from baseline

Recommendation:
Escalate for manual fraud investigation.


---

## Project Structure

fraud-agent-system/
│
├── backend/
│ ├── coordinator_agent.py
│ ├── fraud_agent.py
│ ├── investigation_agent.py
│ ├── explanation_agent.py
│ ├── recommendation_agent.py
│ ├── report_agent.py
│
├── models/
├── data/
│
├── insight-guardian/
│ ├── src/
│ ├── components/
│ ├── pages/
│ ├── services
│ ├── App.jsx
│ └── main.jsx
│
├── requirements.txt
└── README.md


---

## Setup and Installation

1. Clone the Repository

git clone https://github.com/your-username/fraud-agent-system.git
cd fraud-agent-system

2. Create Virtual Environment (Backend)
python -m venv venv

- # Activate it:

Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

3. Install Backend Dependencies

pip install -r requirements.txt

4. Setup Ollama (Mistral LLM)

Install Ollama from:
https://ollama.com

Then pull and run Mistral:
ollama run mistral

Keep this running in the background while using the system.

5. Run Backend Server

If using FastAPI:
uvicorn app.main:app --reload

Backend will run at:
http://127.0.0.1:8000

API docs:
http://127.0.0.1:8000/docs

6. Run React Frontend (Insight Guardian)

Open a new terminal:
cd insight-guardian
npm install
npm run dev

Frontend will run at:
http://localhost:5173

7. Connect Frontend to Backend

Inside:
insight-guardian/src/services/api.js

Set backend URL:
const BASE_URL = "http://127.0.0.1:8000";

For deployment:
const BASE_URL = "https://your-deployed-backend-url.com";

8. Run Full System

Make sure these are running:
Backend (FastAPI)
Frontend (React)
Ollama (Mistral)

Then open:
http://localhost:5173

## Future Improvements

- Real-time claim streaming using Kafka or RabbitMQ
- Fine-tuned domain-specific medical fraud LLM
- Cloud deployment (AWS / Azure)
- Role-based authentication for insurers
- Advanced explainability using SHAP/LIME
- API integrations with insurance providers

---

## Author

This project demonstrates a transition from traditional machine learning models to autonomous AI agent systems capable of reasoning, explaining, and acting in real-world fraud detection workflows.

---

## Key Highlight

This is not just a fraud classifier.

It is an AI-powered fraud investigation assistant that:
- Detects anomalies
- Investigates claims
- Explains decisions
- Generates reports
- Supports human analysts in real time
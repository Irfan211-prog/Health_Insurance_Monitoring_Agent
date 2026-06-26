# Autonomous Health Insurance Fraud Investigation Agent

An end-to-end AI-powered multi-agent system that transforms traditional fraud detection into an intelligent fraud investigation platform.

Instead of only predicting whether a claim is fraudulent, this system behaves like a virtual fraud analyst team—detecting, investigating, reasoning, explaining, and generating structured reports in real time.

It combines Machine Learning, multi-agent architecture, and Ollama (Mistral LLM) to simulate a real-world insurance fraud investigation workflow.

---

# Table of Contents

- Overview
- Problem Statement
- Objectives
- AI Agent Architecture
- System Workflow
- Frontend (Insight Guardian)
- Technology Stack
- Ollama Integration
- Example Output
- Project Structure
- Installation & Setup
- Running the Project
- Future Improvements
- Author

---

# Overview

Traditional fraud detection systems simply classify claims as fraudulent or non-fraudulent.

This project extends beyond binary classification by implementing an autonomous AI-powered investigation platform capable of:

- Detecting suspicious insurance claims
- Investigating anomalies using historical patterns
- Explaining ML predictions through LLM reasoning
- Generating structured investigation reports
- Assisting fraud analysts with real-time decision support

---

# Problem Statement

Insurance companies process thousands of claims daily.

Traditional fraud detection systems face several challenges:

- Manual investigation delays
- Difficulty identifying complex fraud patterns
- High financial losses caused by late detection
- Lack of explainability in machine learning predictions

---

# Objectives

Build an autonomous AI system that can:

- Detect suspicious insurance claims
- Investigate anomalies using historical claim data
- Explain predictions using LLM reasoning
- Generate structured fraud investigation reports
- Support analysts in real time

---

# AI Agent Architecture

This project is not a standalone classifier.

Instead, it behaves as a coordinated team of intelligent agents that:

- Observe incoming claims
- Reason using ML models and business rules
- Investigate anomalies using historical records
- Explain predictions in natural language
- Recommend appropriate actions

---

## Coordinator Agent

Controls the overall workflow and manages communication between all agents.

---

## Fraud Detection Agent

Responsible for fraud prediction.

Features:

- Machine learning-based fraud scoring
- Handles class imbalance using SMOTE / ADASYN
- Outputs fraud probability
- Assigns overall risk level

---

## Investigation Agent

Investigates suspicious claims by:

- Detecting anomalies
- Identifying upcoding
- Detecting duplicate billing
- Detecting abnormal medical charges
- Comparing claims with historical records

---

## Explanation Agent (Ollama + Mistral)

Uses the Mistral LLM through Ollama to generate human-readable explanations.

Responsibilities:

- Explain ML predictions
- Improve model transparency
- Produce analyst-friendly reasoning

---

## Recommendation Agent

Transforms fraud scores into business actions.

Possible recommendations:

- Approve
- Manual Review
- Fraud Escalation

---

## Report Generation Agent

Generates structured fraud investigation reports containing:

- Claim Summary
- Suspicious Indicators
- Evidence-Based Reasoning
- Final Recommendation

---

# System Workflow

```
Incoming Claim
        │
        ▼
Data Preprocessing
        │
        ▼
Fraud Detection Agent (ML Model)
        │
        ▼
Coordinator Agent
        │
        ▼
Investigation Agent
        │
        ▼
Explanation Agent (Ollama + Mistral)
        │
        ▼
Recommendation Agent
        │
        ▼
Report Generation Agent
        │
        ▼
Action System
(Approve / Flag / Escalate)
```

---

# Frontend (Insight Guardian)

The project includes a React-based frontend dashboard located in:

```
insight-guardian/
```

The dashboard serves as the analyst interface for interacting with the fraud investigation platform.

## Features

- Claim submission interface
- Fraud risk score visualization
- AI-generated explanation panel
- Investigation insights dashboard
- Analytics and trend visualization
- Structured report viewer

---

# Frontend–Backend Integration

```
React UI (Insight Guardian)
            │
            ▼
      API Calls (Axios)
            │
            ▼
     FastAPI / Flask Backend
            │
            ▼
 Fraud Detection + Multi-Agent System
            │
            ▼
     Ollama (Mistral LLM)
            │
            ▼
        JSON Response
            │
            ▼
 React Dashboard Rendering
```

---

# Technology Stack

## Core ML & Data

- Python
- pandas
- numpy
- scikit-learn
- imbalanced-learn (SMOTE / ADASYN)

---

## AI / LLM

- Ollama
- Mistral LLM
- Prompt Engineering
- Multi-Agent Orchestration

---

## Backend

- FastAPI / Flask
- REST APIs
- JSON Communication

---

## Frontend

- React
- Axios
- Chart.js / Recharts
- Tailwind CSS

---

# Ollama + Mistral Integration

This project uses Ollama for local LLM inference.

## Setup

```bash
ollama run mistral
```

## Usage

The LLM is responsible for:

- Generating explanations for fraud predictions
- Converting ML outputs into natural language
- Improving interpretability and analyst trust

---

# Example Output

## Fraud Risk Prediction

```
Risk Score: 0.89 (HIGH RISK)

Action:
ESCALATE TO FRAUD INVESTIGATION TEAM
```

---

## LLM Explanation

```
The claim shows unusually high billing for standard procedures.

Similar patterns have been observed in historical fraud cases involving the same provider.

The cost significantly deviates from expected medical benchmarks.
```

---

## Generated Report

```
Claim Summary

High-value orthopedic treatment claim.

Suspicious Indicators

• Excessive billing for standard procedures
• Repeated usage pattern from same hospital
• Significant cost deviation from baseline

Recommendation

Escalate for manual fraud investigation.
```

---

# Project Structure

```
fraud-agent-system/
│
├── backend/
│   ├── coordinator_agent.py
│   ├── fraud_agent.py
│   ├── investigation_agent.py
│   ├── explanation_agent.py
│   ├── recommendation_agent.py
│   └── report_agent.py
│
├── models/
│
├── data/
│
├── insight-guardian/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── requirements.txt
└── README.md
```

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/fraud-agent-system.git

cd fraud-agent-system
```

---

## 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it.

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

---

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Install Ollama

Install Ollama.

Then pull and run Mistral.

```bash
ollama run mistral
```

Keep Ollama running while using the system.

---

## 5. Run the Backend

### FastAPI

```bash
uvicorn app.main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

API Documentation

```
http://127.0.0.1:8000/docs
```

---

## 6. Run the React Frontend

```bash
cd insight-guardian

npm install

npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

## 7. Connect Frontend to Backend

Inside

```
insight-guardian/src/services/api.js
```

Local Development

```javascript
const BASE_URL = "http://127.0.0.1:8000";
```

Deployment

```javascript
const BASE_URL = "https://your-deployed-backend-url.com";
```

---

# Running the Complete System

Ensure the following services are running:

- Backend (FastAPI)
- React Frontend
- Ollama (Mistral)

Then open:

```
http://localhost:5173
```

---

# Future Improvements

- Real-time claim streaming using Kafka or RabbitMQ
- Fine-tuned domain-specific medical fraud LLM
- Cloud deployment (AWS / Azure)
- Role-based authentication
- Advanced explainability using SHAP / LIME
- API integrations with insurance providers

---

# Author

This project demonstrates the transition from traditional machine learning models to autonomous AI agent systems capable of reasoning, explaining, investigating, and acting in real-world healthcare fraud detection workflows.

---

# Key Highlight

This is **not** just a fraud classifier.

It is an AI-powered fraud investigation assistant that:

- Detects anomalies
- Investigates claims
- Explains decisions
- Generates structured reports
- Supports human analysts in real time
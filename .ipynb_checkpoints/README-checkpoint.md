# 🏥🤖 Autonomous Health Insurance Fraud Investigation Agent

An AI-driven, end-to-end system designed to go beyond traditional fraud detection models. Instead of simply predicting a binary classification, this system acts as a **virtual fraud analyst**—analyzing claims deeply, investigating the "why" behind anomalies, generating explainable reports, and executing automated workflows.

This project demonstrates the shift from standard Machine Learning models to **Intelligent AI Agents**.

---

## 🎯 Problem Statement
Health insurance companies process thousands of claims daily. Traditional manual fraud detection is:
* ⏳ **Time-consuming**
* ⚠️ **Error-prone**
* 💰 **Expensive**

Fraudulent claims lead to massive financial losses and operational inefficiencies. 

**Objective:** Build an autonomous AI agent that detects, investigates, and explains suspicious insurance claims in real time.

---

## 🧠 What Makes This Project an "AI Agent"?
Unlike a standalone machine learning model that outputs a raw probability score, this system:
* **Observes:** Continuously ingests incoming claim data.
* **Reasons:** Combines ML risk scores with programmatic business rules.
* **Investigates:** Proactively cross-references anomalies against historical databases.
* **Contextualizes:** Uses external knowledge (past claim histories, hospital patterns).
* **Explains & Acts:** Generates automated natural language reports and triggers downstream workflows (approve/escalate).

> 💡 *It behaves like an automated junior insurance fraud investigator, not just a black-box classifier.*

---

## ⚙️ Key Features

### 🔍 1. Intelligent Fraud Detection
* Machine Learning-based fraud scoring system.
* Handles heavy class imbalance using **SMOTE / ADASYN**.
* Outputs a normalized fraud probability alongside calibrated risk levels.

### 🧠 2. AI Investigation Engine
* Detects anomalies across multiple vectors: billing amounts, treatment types, hospital networks, and patient histories.
* Identifies complex, hidden fraud patterns (e.g., unbundling, upcoding).

### 📊 3. Tiered Risk Scoring System
* 🟢 **Low Risk:** Auto-approve claim for faster processing.
* 🟡 **Medium Risk:** Route to flag queue for human review.
* 🔴 **High Risk:** Immediate fraud alert and automated hold.

### 🧾 4. Automated Fraud Report Generator
* Powered by LLM-based reasoning to generate structured, human-readable audit trails containing:
    * Claim Summary
    * Suspicious Indicators & Supporting Evidence
    * Similar Historical Cases
    * Final Actionable Recommendation

### 🚨 5. Action & Alert System
* Real-time system alerts and claim escalation workflows.
* Webhook integrations for email/SMS notifications (optional).

### 📡 6. Interactive Dashboard *(Optional Upgrade)*
* Live claim monitoring, fraud trend analytics, and hospital-wise risk heatmaps.

---

## 🧱 System Architecture

```text
📥 Claim Input
      ↓
🧹 Data Preprocessing
      ↓
🤖 Fraud Detection Model (ML)
      ↓
📊 Risk Scoring Engine
      ↓
🧠 AI Investigation Agent
      ↓
🧾 Report Generator (LLM-based)
      ↓
🚨 Action System (Alert / Approve / Escalate)

🛠 Tech Stack
Core ML & Data: Python 🐍, scikit-learn, pandas, numpy

Deep Learning (Optional): PyTorch / TensorFlow

Backend & APIs: FastAPI / Flask (REST APIs, Authentication)

AI Agent Layer: LLM APIs (GPT / Open-source LLMs), Prompt Engineering, Tool-calling workflows

Visualization: Streamlit, Plotly, Matplotlib
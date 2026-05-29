# Fiscal Integration & Anomaly Detection Platform

A production-ready cloud platform for real-time transaction monitoring and AI-powered fraud detection, specifically designed for the Malawian fintech ecosystem.

## 🚀 System Architecture
- **Backend:** Node.js (Express + TypeScript) with Prisma ORM.
- **Frontend:** React (Vite) with a premium dark-mode dashboard.
- **ML Microservice:** Python (FastAPI) running an Ensemble model (Isolation Forest + LOF).
- **Database:** SQLite (Development) / PostgreSQL (Production).
- **Integration:** Native PayChangu API support and POS Ingestion via API Key.

## 🧠 Machine Learning Engine
The system uses an **Ensemble Model** for high-precision fraud detection:
- **Isolation Forest:** Detects global outliers in transaction volume.
- **Local Outlier Factor (LOF):** Detects density-based anomalies (local outliers).
- **Explainable AI (XAI):** Returns clear reasons for every flagged transaction (e.g., "Velocity Spike", "Abnormal Amount").
- **Persistence:** Models are saved to `models/ensemble_v2.joblib` for consistency.

## 🛠 Setup Instructions

### 1. ML Service (Python)
```bash
cd ml_service
pip install -r requirements.txt
python app.py
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Simulation & Testing
To see the system in action with realistic business data:
```bash
cd backend
node production_simulator.js
```
The simulator mimics:
- **Small Retailers:** Consistent, small transactions.
- **Wholesalers:** Large, periodic transactions.
- **Fraud Patterns:** Velocity attacks, night-time outliers, and extreme amount spikes.

## 🛡 Security Features
- **API Key Authentication:** POS systems use unique keys for ingestion.
- **JWT Authorization:** Dashboard access is restricted via secure tokens.
- **Data Hashing:** Sensitive IDs are hashed before being processed by the ML engine.
- **Explainability:** Auditable fraud logs with AI-generated justifications.

## 📄 Documentation
- **API Docs:** Available at `http://localhost:8000/docs` (Swagger UI).
- **Webhooks:** Ingest transactions via `POST /api/transactions/ingest` with `x-api-key`.

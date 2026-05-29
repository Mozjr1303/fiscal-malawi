from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field, validator
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from datetime import datetime
import joblib
import logging
import hashlib
from typing import List, Optional, Dict

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("ML_Security_Service")

app = FastAPI(title="Fiscal Integration ML Service", version="2.0.0")

# --- DATA MODELS ---
class TransactionIn(BaseModel):
    id: str
    amount: float = Field(..., gt=0)
    timestamp: str
    paymentMethod: str
    userId: str
    location: Optional[str] = "Unknown"

    @validator('amount')
    def validate_amount(cls, v):
        if v > 1000000: # Fiscal limit for Malawian SME transactions
            raise ValueError('Transaction amount exceeds maximum allowable limit')
        return v

class AnomalyResponse(BaseModel):
    transaction_id: str
    is_anomaly: bool
    anomaly_score: float
    reasons: List[str]
    confidence: float
    metadata: Dict

# --- CORE ML ENGINE ---
class ProductionAnomalyDetector:
    def __init__(self, model_path="models/ensemble_v2.joblib"):
        self.model_path = model_path
        self.iso_forest = IsolationForest(n_estimators=200, contamination=0.03, random_state=42)
        self.lof = LocalOutlierFactor(n_neighbors=20, contamination=0.03, novelty=True)
        self.user_stats = {} # In-memory user behavior store (Production would use Redis)
        self.is_trained = False
        self.load_model()

    def hash_id(self, original_id: str):
        return hashlib.sha256(original_id.encode()).hexdigest()[:12]

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                data = joblib.load(self.model_path)
                self.iso_forest = data['iso_forest']
                self.lof = data['lof']
                self.is_trained = True
                logger.info("✅ Production models loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")

    def save_model(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump({'iso_forest': self.iso_forest, 'lof': self.lof}, self.model_path)

    def engineer_features(self, tx_data: dict):
        # 1. Basic Features
        amount = tx_data['amount']
        dt = pd.to_datetime(tx_data['timestamp'])
        hour = dt.hour
        day_of_week = dt.dayofweek
        
        # 2. Behavioral Features (Velocity & History)
        uid = tx_data['userId']
        if uid not in self.user_stats:
            self.user_stats[uid] = {"count": 0, "total": 0, "avg": 0, "last_tx": dt}
        
        stats = self.user_stats[uid]
        time_diff = (dt - stats['last_tx']).total_seconds()
        velocity = 1 / (time_diff + 1) # Higher if transactions are close together
        
        z_score = 0
        if stats['count'] > 5:
            z_score = abs(amount - stats['avg']) / (amount + 1)

        # Update stats
        stats['count'] += 1
        stats['total'] += amount
        stats['avg'] = stats['total'] / stats['count']
        stats['last_tx'] = dt

        methods = {'credit_card': 1, 'mobile_money': 2, 'bank_transfer': 3, 'cash': 4}
        method_code = methods.get(tx_data['paymentMethod'], 0)

        return np.array([[amount, hour, day_of_week, velocity, z_score, method_code]])

    def explain_anomaly(self, features, tx_data):
        reasons = []
        amount = tx_data['amount']
        velocity = features[0][3]
        z_score = features[0][4]
        hour = features[0][1]

        if amount > 5000: reasons.append("Highly unusual transaction amount")
        if velocity > 0.5: reasons.append("Velocity spike detected (multiple rapid attempts)")
        if z_score > 2.0: reasons.append("Significant deviation from user's typical spending")
        if hour < 5 or hour > 23: reasons.append("Abnormal transaction time (Night activity)")
        
        return reasons if reasons else ["Slightly irregular pattern detected"]

    def predict(self, tx_data: dict):
        X = self.engineer_features(tx_data)
        
        if not self.is_trained:
            # Emergency fallback: train on first 100 dummy samples
            dummy_X = np.random.rand(100, 6)
            self.iso_forest.fit(dummy_X)
            self.lof.fit(dummy_X)
            self.is_trained = True

        iso_pred = self.iso_forest.predict(X)[0]
        lof_pred = self.lof.predict(X)[0]
        
        iso_score = -self.iso_forest.decision_function(X)[0]
        
        # Consensus: If either model flags high risk
        is_anomaly = (iso_pred == -1) or (lof_pred == -1 and iso_score > 0.1)
        
        reasons = []
        if is_anomaly:
            reasons = self.explain_anomaly(X, tx_data)

        # Flag anomaly ONLY if transaction is more than 1000 MK (Malawian Kwacha)
        if tx_data['amount'] <= 1000:
            is_anomaly = False
            reasons = []

        return {
            "is_anomaly": bool(is_anomaly),
            "score": float(iso_score),
            "reasons": reasons,
            "hashed_user": self.hash_id(tx_data['userId'])
        }

# --- INITIALIZATION ---
import os
detector = ProductionAnomalyDetector()

@app.post("/predict", response_model=AnomalyResponse)
async def predict_transaction(tx: TransactionIn):
    try:
        result = detector.predict(tx.dict())
        
        return AnomalyResponse(
            transaction_id=tx.id,
            is_anomaly=result['is_anomaly'],
            anomaly_score=result['score'],
            reasons=result['reasons'],
            confidence=0.85 if result['is_anomaly'] else 0.99,
            metadata={
                "hashed_user": result['hashed_user'],
                "processed_at": datetime.now().isoformat()
            }
        )
    except Exception as e:
        logger.error(f"Prediction Error: {str(e)}")
        raise HTTPException(status_code=500, detail="ML Engine Processing Error")

@app.get("/health")
async def health():
    return {"status": "operational", "model_trained": detector.is_trained}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

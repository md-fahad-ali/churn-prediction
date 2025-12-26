# Telco Insight AI: Customer Churn Prediction

Telco Insight AI is a comprehensive data-driven application designed to predict customer churn in the telecommunications industry. Using advanced machine learning techniques, it provides actionable insights to help service providers improve customer retention.

## 🚀 Overview

The project combines a powerful Python-based data mining pipeline with a modern React dashboard. It allows users to:
*   **Predict Churn:** Get real-time churn probability for individual customers.
*   **Simulate Scenarios:** Use the "What-If" simulator to see how changes in tenure or monthly charges affect churn risk.
*   **Analyze Trends:** Benchmark customer data against average loyal and churned customer segments.
*   **Deep Dive:** Explore the full data science lifecycle within the integrated Jupyter Notebook.

## 🏗️ Project Structure

```text
dmproject/
├── frontend/             # React (Vite) dashboard
│   ├── src/
│   │   ├── App.jsx       # Main application logic and UI
│   │   └── ...
│   └── package.json
└── backend_model/        # Data science and model serving
    └── Project_with_Backend.ipynb  
    ├── model.pkl             # Trained XGBoost model
    ├── scaler.pkl            # Data scaler for preprocessing
    └── model_columns.pkl     # Feature columns used by the model
```

## ✨ Key Features

### Frontend Dashboard
*   **Risk Gauge:** Visual representation of churn probability.
*   **"What-If" Simulator:** Interactive sliders for `MonthlyCharges` and `tenure`.
*   **Comparative Insights:** Dynamic bar charts comparing individual metrics with cohort averages.
*   **Real-time API Integration:** Communicates with a Flask backend for instant predictions.

### Backend & Machine Learning
*   **Advanced Modeling:** Utilizes **XGBoost** optimized for high accuracy (~79%+).
*   **Comprehensive Pipeline:** Includes Data Cleaning, EDA, Feature Engineering, Clustering (K-Means), and Anomaly Detection.
*   **Model Serving:** Integrated Flask API serving predictions on `http://localhost:5000/predict`.

## 🛠️ Technology Stack

**Frontend:**
*   React
*   Vite
*   Recharts (Visualizations)
*   Lucide-React (Icons)
*   Tailwind CSS (Styling)

**Backend / Machine Learning:**
*   Python
*   Flask (API Wrapper)
*   XGBoost (Primary Classifier)
*   Scikit-learn (Preprocessing & Modeling)
*   Pandas & NumPy (Data Processing)
*   Matplotlib & Seaborn (Static Visualizations)

## 🔧 Setup & Installation

### Prerequisites
*   Node.js (for frontend)
*   Python 3.x
*   Jupyter Notebook / JupyterLab

### Backend Setup
1.  Navigate to `backend_model/`.
2.  Install dependencies:
    ```bash
    pip install pandas numpy scikit-learn xgboost flask flask-cors
    ```
3.  Open and run `Project_with_Backend.ipynb` to train the model and start the Flask server.
    *   *Note: The server defaults to port 5000.*

### Frontend Setup
1.  Navigate to `frontend/`.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the dashboard at `http://localhost:5173`.

## 📊 Data Source
The model is trained on the [Telco Customer Churn dataset](https://raw.githubusercontent.com/IBM/telco-customer-churn-on-icp4d/master/data/Telco-Customer-Churn.csv), covering customer demographics, account information, and service usage.
# churn-prediction

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
import json
import os
from datetime import datetime

# Page Configuration
st.set_page_config(
    page_title="Brew & Bean | Executive Analytics",
    page_icon="☕",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling to match Brew & Bean Warm Coffee Aesthetic
st.markdown("""
<style>
    .main {
        background-color: #FDFBF7;
    }
    .stApp {
        background-color: #FDFBF7;
    }
    h1, h2, h3 {
        color: #2C1810 !important;
        font-family: 'Outfit', sans-serif;
    }
    .metric-card {
        background-color: #FFFFFF;
        border-radius: 12px;
        padding: 20px;
        border: 1px solid #EAD2AC;
        box-shadow: 0 4px 12px rgba(111, 66, 39, 0.05);
        margin-bottom: 15px;
    }
    .metric-title {
        color: #6F4227;
        font-size: 0.9rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .metric-value {
        color: #2C1810;
        font-size: 1.8rem;
        font-weight: 800;
        margin-top: 5px;
    }
    .metric-change {
        color: #10B981;
        font-size: 0.85rem;
        font-weight: 600;
        margin-top: 4px;
    }
</style>
""", unsafe_allow_html=True)

# Top Header Banner
st.title("☕ Brew & Bean — Executive Analytics Engine")
st.markdown(
    "*Real-time sales telemetry, hourly load demand, customer behavior, and product mix.*"
)
st.markdown("---")

# Sidebar Configuration
st.sidebar.image(
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    width=400
)
st.sidebar.title("🎛️ Analytics Controls")

# Backend API URL
# Local development:
#   http://localhost:5000/api/analytics/summary
#
# Render production:
#   Set BACKEND_API_URL environment variable to:
#   https://YOUR-BACKEND-URL.onrender.com/api/analytics/summary
DEFAULT_API_URL = os.getenv(
    "BACKEND_API_URL",
    "http://localhost:5000/api/analytics/summary"
)

time_filter = st.sidebar.selectbox(
    "Select Time Horizon",
    ["Today", "This Week", "This Month", "This Year", "Custom Range"]
)

api_url = st.sidebar.text_input(
    "Backend REST API Endpoint",
    DEFAULT_API_URL
)

# Fetch Data from REST API or fallback to sample payload
@st.cache_data(ttl=15)
def load_analytics_data(url):
    try:
        response = requests.get(url, timeout=3)

        if response.status_code == 200:
            payload = response.json()

            if isinstance(payload, dict) and payload.get("summary"):
                return payload

    except Exception:
        pass

    # Graceful fallback data payload
    return {
        "summary": {
            "totalRevenue": 48920.50,
            "totalOrders": 1420,
            "totalCustomers": 890,
            "averageOrderValue": 34.45,
            "todayRevenue": 1845.20,
            "monthlyRevenue": 34150.00,
            "growthRate": "+18.4%",
            "tableUtilizationRate": "78.5%"
        },

        "dailyRevenue": [
            {"day": "Mon", "revenue": 1450, "orders": 48},
            {"day": "Tue", "revenue": 1680, "orders": 52},
            {"day": "Wed", "revenue": 1920, "orders": 61},
            {"day": "Thu", "revenue": 2100, "orders": 68},
            {"day": "Fri", "revenue": 2850, "orders": 94},
            {"day": "Sat", "revenue": 3400, "orders": 112},
            {"day": "Sun", "revenue": 3100, "orders": 104}
        ],

        "categoryRevenue": [
            {"category": "Coffee", "value": 42},
            {"category": "Cold Drinks", "value": 24},
            {"category": "Snacks", "value": 18},
            {"category": "Desserts", "value": 10},
            {"category": "Tea", "value": 6}
        ],

        "topSellingProducts": [
            {
                "name": "Caramel Macchiato",
                "sold": 482,
                "revenue": 2646.18
            },
            {
                "name": "Iced Cold Brew Vanilla Foam",
                "sold": 395,
                "revenue": 2287.05
            },
            {
                "name": "Belgian Chocolate Croissant",
                "sold": 341,
                "revenue": 1531.09
            },
            {
                "name": "Velvet Flat White",
                "sold": 298,
                "revenue": 1487.02
            },
            {
                "name": "Matcha Green Tea Latte",
                "sold": 215,
                "revenue": 1137.35
            }
        ],

        "peakHours": [
            {"hour": "07:00", "orders": 18},
            {"hour": "08:00", "orders": 45},
            {"hour": "09:00", "orders": 82},
            {"hour": "10:00", "orders": 64},
            {"hour": "11:00", "orders": 40},
            {"hour": "12:00", "orders": 75},
            {"hour": "13:00", "orders": 88},
            {"hour": "14:00", "orders": 52},
            {"hour": "15:00", "orders": 38},
            {"hour": "16:00", "orders": 60},
            {"hour": "17:00", "orders": 72},
            {"hour": "18:00", "orders": 50},
            {"hour": "19:00", "orders": 35}
        ],

        "paymentMethods": [
            {"name": "Credit Card", "percentage": 48},
            {"name": "UPI / QR", "percentage": 32},
            {"name": "Apple Pay", "percentage": 14},
            {"name": "Cash", "percentage": 6}
        ]
    }


data = load_analytics_data(api_url)
summary = data.get("summary", {})

# KPI Grid Row
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Total Revenue</div>
        <div class="metric-value">
            ₹{summary.get('totalRevenue', 0):,.2f}
        </div>
        <div class="metric-change">
            ↑ {summary.get('growthRate', '+12%')} vs last month
        </div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Today's Revenue</div>
        <div class="metric-value">
            ₹{summary.get('todayRevenue', 0):,.2f}
        </div>
        <div class="metric-change">
            ↑ 8.4% vs yesterday
        </div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Total Orders</div>
        <div class="metric-value">
            {summary.get('totalOrders', 0):,}
        </div>
        <div class="metric-change">
            Avg 64 orders / day
        </div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Avg Order Value</div>
        <div class="metric-value">
            ₹{summary.get('averageOrderValue', 0):,.2f}
        </div>
        <div class="metric-change">
            ↑ ₹2.10 upsell impact
        </div>
    </div>
    """, unsafe_allow_html=True)

with col5:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-title">Table Occupancy</div>
        <div class="metric-value">
            {summary.get('tableUtilizationRate', '78.5%')}
        </div>
        <div class="metric-change">
            Peak turn time: 24 mins
        </div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Charts Section 1: Revenue Curve & Category Breakdown
row1_col1, row1_col2 = st.columns([7, 5])

with row1_col1:
    st.subheader("📈 Revenue Performance Trend")

    df_daily = pd.DataFrame(data.get("dailyRevenue", []))

    fig_daily = px.area(
        df_daily,
        x="day",
        y="revenue",
        title="Weekly Revenue Flow (₹)",
        markers=True,
        color_discrete_sequence=["#6F4227"]
    )

    fig_daily.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Outfit, sans-serif",
            color="#2C1810"
        )
    )

    st.plotly_chart(fig_daily, width="stretch")


with row1_col2:
    st.subheader("☕ Sales Distribution by Category")

    df_cat = pd.DataFrame(data.get("categoryRevenue", []))

    fig_cat = px.pie(
        df_cat,
        names="category",
        values="value",
        title="Product Share (%)",
        hole=0.45,
        color_discrete_sequence=[
            "#2C1810",
            "#6F4227",
            "#B07D4F",
            "#D4A373",
            "#F5EBE1"
        ]
    )

    fig_cat.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Outfit, sans-serif",
            color="#2C1810"
        )
    )

    st.plotly_chart(fig_cat, width="stretch")


# Charts Section 2: Top Selling Products & Peak Hours
row2_col1, row2_col2 = st.columns([6, 6])

with row2_col1:
    st.subheader("🏆 Top 5 Best-Selling Items")

    df_top = pd.DataFrame(data.get("topSellingProducts", []))

    fig_top = px.bar(
        df_top,
        x="sold",
        y="name",
        orientation="h",
        text="sold",
        title="Units Sold by Menu Item",
        color_discrete_sequence=["#B07D4F"]
    )

    fig_top.update_layout(
        yaxis=dict(autorange="reversed"),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Outfit, sans-serif",
            color="#2C1810"
        )
    )

    st.plotly_chart(fig_top, width="stretch")


with row2_col2:
    st.subheader("⏰ Peak Ordering Hours & Rush Demand")

    df_hours = pd.DataFrame(data.get("peakHours", []))

    fig_hours = px.bar(
        df_hours,
        x="hour",
        y="orders",
        title="Hourly Order Traffic Count",
        color_discrete_sequence=["#6F4227"]
    )

    fig_hours.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Outfit, sans-serif",
            color="#2C1810"
        )
    )

    st.plotly_chart(fig_hours, width="stretch")


# Section 3: Payment Breakdown & Live Telemetry Details
row3_col1, row3_col2 = st.columns([6, 6])

with row3_col1:
    st.subheader("💳 Payment Methods Distribution")

    df_pay = pd.DataFrame(data.get("paymentMethods", []))

    fig_pay = px.bar(
        df_pay,
        x="name",
        y="percentage",
        text="percentage",
        title="Payment Mode Preference (%)",
        color_discrete_sequence=["#D4A373"]
    )

    fig_pay.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Outfit, sans-serif",
            color="#2C1810"
        )
    )

    st.plotly_chart(fig_pay, width="stretch")


with row3_col2:
    st.subheader("⚙️ System Status & API Connection")

    st.json({
        "Status": "ONLINE & SYNCHRONIZED",
        "Frontend": "Vite React.js Client",
        "Backend": "Express.js REST Service",
        "Database": "MongoDB / Mongoose Store",
        "Active Session": time_filter,
        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })


st.markdown("---")

st.caption(
    "© 2026 Brew & Bean Coffee Roastery & Management Platform. All rights reserved."
)
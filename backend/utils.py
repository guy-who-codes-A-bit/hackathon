import os
import random
import string
import smtplib
from datetime import date
from dotenv import load_dotenv
from models import db

load_dotenv()


def send_mail(to_address: str, subject: str, body: str):
    """Send an email using Gmail SMTP."""
    gmail = os.getenv("GMAIL")
    password = os.getenv("GMAIL_PASS")
    if not gmail or not password:
        print("⚠️ Missing Gmail credentials in .env")
        return False

    msg = f"Subject: {subject}\n\n{body}"
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail, password)
        server.sendmail(gmail, to_address, msg.encode("utf-8"))
        server.quit()
        return True
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False


def refresh_daily_tokens(user):
    """Give +1 token if it's a new day (max 2 total)."""
    today = date.today()
    if user.last_token_date != today:
        user.tokens = min(user.tokens + 1, 2)
        user.last_token_date = today
        user.claims_today = 0
        db.session.commit()

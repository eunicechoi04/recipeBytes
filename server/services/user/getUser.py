from flask import jsonify
from sqlalchemy.orm import Session
from models.user import User
import traceback

def get_user_service(db: Session, username: str):
    try:
        user = db.query(User).filter(User.username == username).first()
        print(user)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_info = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
        return jsonify(user_info), 201
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
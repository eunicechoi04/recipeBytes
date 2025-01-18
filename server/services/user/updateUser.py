from flask import jsonify
from sqlalchemy.orm import Session
from models.user import User

def update_user_service(db: Session, data: dict):
    try:
        user_id = data.get('id')
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)

        db.commit()

        return jsonify({"message": "User updated successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
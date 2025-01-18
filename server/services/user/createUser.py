from flask import jsonify
from sqlalchemy.orm import Session
from models.user import User

def create_user_service(db: Session, data: dict):
    try:
        new_user = User(
            id=data.get('id'),
            username=data.get('username'),
            email=data.get('email'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
        )
        db.add(new_user)
        db.commit()

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
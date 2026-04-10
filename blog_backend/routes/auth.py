from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('fullName', '').strip()
    username  = data.get('username', '').strip().lower()
    password  = data.get('password', '')

    if not all([full_name, username, password]):
        return jsonify({'error': 'Tous les champs sont requis'}), 400

    if len(password) < 4:
        return jsonify({'error': 'Le mot de passe doit faire au moins 4 caractères'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': "Ce nom d'utilisateur est déjà pris"}), 409

    user = User(full_name=full_name, username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({'user': user.to_dict(), 'token': token}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data     = request.get_json()
    username = data.get('username', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Identifiants incorrects'}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({'user': user.to_dict(), 'token': token}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user    = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

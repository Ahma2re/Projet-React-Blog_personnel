from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
from extensions import db
from models.user import User
from models.friendship import Friendship

friends_bp = Blueprint('friends', __name__, url_prefix='/api/friends')


# ── Rechercher des utilisateurs ────────────────────────────────────────────────

@friends_bp.route('/search', methods=['GET'])
@jwt_required()
def search():
    user_id = int(get_jwt_identity())
    query   = request.args.get('q', '').strip()

    if not query:
        return jsonify([]), 200

    users = User.query.filter(
        User.id != user_id,
        User.username.ilike(f'%{query}%')
    ).limit(20).all()

    return jsonify([u.to_dict() for u in users]), 200


# ── Envoyer une demande d'ami ──────────────────────────────────────────────────

@friends_bp.route('/request', methods=['POST'])
@jwt_required()
def send_request():
    requester_id = int(get_jwt_identity())
    receiver_id  = request.get_json().get('receiverId')

    if not receiver_id or requester_id == receiver_id:
        return jsonify({'error': 'ID invalide'}), 400

    if not User.query.get(receiver_id):
        return jsonify({'error': 'Utilisateur introuvable'}), 404

    existing = Friendship.query.filter(
        or_(
            and_(Friendship.requester_id == requester_id, Friendship.receiver_id == receiver_id),
            and_(Friendship.requester_id == receiver_id,  Friendship.receiver_id == requester_id)
        )
    ).first()

    if existing:
        return jsonify({'error': 'Une relation existe déjà'}), 409

    friendship = Friendship(requester_id=requester_id, receiver_id=receiver_id, status='pending')
    db.session.add(friendship)
    db.session.commit()
    return jsonify(friendship.to_dict()), 201


# ── Demandes reçues en attente ────────────────────────────────────────────────

@friends_bp.route('/requests/pending', methods=['GET'])
@jwt_required()
def pending_requests():
    user_id  = int(get_jwt_identity())
    requests = Friendship.query.filter_by(receiver_id=user_id, status='pending').all()
    return jsonify([f.to_dict() for f in requests]), 200


# ── Répondre à une demande ────────────────────────────────────────────────────

@friends_bp.route('/request/<int:friendship_id>/respond', methods=['PUT'])
@jwt_required()
def respond(friendship_id):
    user_id    = int(get_jwt_identity())
    friendship = Friendship.query.get_or_404(friendship_id)

    if friendship.receiver_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403

    action = request.get_json().get('action')
    if action not in ('accept', 'reject'):
        return jsonify({'error': 'Action invalide'}), 400

    friendship.status = 'accepted' if action == 'accept' else 'rejected'
    db.session.commit()
    return jsonify(friendship.to_dict()), 200


# ── Liste de mes amis ─────────────────────────────────────────────────────────

@friends_bp.route('', methods=['GET'])
@jwt_required()
def my_friends():
    user_id     = int(get_jwt_identity())
    friendships = Friendship.query.filter(
        or_(
            Friendship.requester_id == user_id,
            Friendship.receiver_id  == user_id
        ),
        Friendship.status == 'accepted'
    ).all()

    result = []
    for f in friendships:
        friend = f.receiver if f.requester_id == user_id else f.requester
        result.append({
            'friendshipId': f.id,
            **friend.to_dict()
        })

    return jsonify(result), 200


# ── Supprimer un ami ──────────────────────────────────────────────────────────

@friends_bp.route('/<int:friendship_id>', methods=['DELETE'])
@jwt_required()
def remove_friend(friendship_id):
    user_id    = int(get_jwt_identity())
    friendship = Friendship.query.get_or_404(friendship_id)

    if user_id not in (friendship.requester_id, friendship.receiver_id):
        return jsonify({'error': 'Non autorisé'}), 403

    db.session.delete(friendship)
    db.session.commit()
    return jsonify({'message': 'Ami supprimé'}), 200


# ── Bloquer un utilisateur ────────────────────────────────────────────────────

@friends_bp.route('/<int:friendship_id>/block', methods=['PUT'])
@jwt_required()
def block_user(friendship_id):
    user_id    = int(get_jwt_identity())
    friendship = Friendship.query.get_or_404(friendship_id)

    if user_id not in (friendship.requester_id, friendship.receiver_id):
        return jsonify({'error': 'Non autorisé'}), 403

    friendship.status       = 'blocked'
    friendship.requester_id = user_id
    friendship.receiver_id  = (
        friendship.receiver_id if friendship.requester_id == user_id
        else friendship.requester_id
    )
    db.session.commit()
    return jsonify(friendship.to_dict()), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.article import Article, Comment
from models.friendship import Friendship

articles_bp = Blueprint('articles', __name__, url_prefix='/api/articles')


def get_accepted_friend_ids(user_id):
    friendships = Friendship.query.filter(
        ((Friendship.requester_id == user_id) | (Friendship.receiver_id == user_id)),
        Friendship.status == 'accepted'
    ).all()
    return [
        f.receiver_id if f.requester_id == user_id else f.requester_id
        for f in friendships
    ]


def get_blocked_by_me(user_id):
    blocked = Friendship.query.filter_by(requester_id=user_id, status='blocked').all()
    return [f.receiver_id for f in blocked]


# ── Mes articles ──────────────────────────────────────────────────────────────

@articles_bp.route('/mine', methods=['GET'])
@jwt_required()
def my_articles():
    user_id  = int(get_jwt_identity())
    articles = Article.query.filter_by(author_id=user_id).order_by(Article.created_at.desc()).all()
    return jsonify([a.to_dict() for a in articles]), 200


# ── Fil d'actualité ───────────────────────────────────────────────────────────

@articles_bp.route('/feed', methods=['GET'])
@jwt_required()
def feed():
    user_id    = int(get_jwt_identity())
    friend_ids = get_accepted_friend_ids(user_id)
    blocked    = get_blocked_by_me(user_id)

    visible_friend_ids = [fid for fid in friend_ids if fid not in blocked]

    articles = Article.query.filter(
        (Article.author_id == user_id) |
        (
            Article.author_id.in_(visible_friend_ids) &
            (Article.is_public == True)
        )
    ).order_by(Article.created_at.desc()).all()

    return jsonify([a.to_dict() for a in articles]), 200


# ── Créer un article ──────────────────────────────────────────────────────────

@articles_bp.route('', methods=['POST'])
@jwt_required()
def create_article():
    user_id = int(get_jwt_identity())
    data    = request.get_json()

    title   = data.get('title', '').strip()
    content = data.get('content', '').strip()
    if not title or not content:
        return jsonify({'error': 'Titre et contenu sont requis'}), 400

    article = Article(
        author_id      = user_id,
        title          = title,
        content        = content,
        is_public      = data.get('isPublic', True),
        allow_comments = data.get('allowComments', True)
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict(include_comments=True)), 201


# ── Détail d'un article ───────────────────────────────────────────────────────

@articles_bp.route('/<int:article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(article_id)

    # Vérifier les droits d'accès
    if article.author_id != user_id:
        if not article.is_public:
            return jsonify({'error': 'Accès refusé'}), 403
        friend_ids = get_accepted_friend_ids(user_id)
        blocked    = get_blocked_by_me(user_id)
        if article.author_id not in friend_ids or article.author_id in blocked:
            return jsonify({'error': 'Accès refusé'}), 403

    return jsonify(article.to_dict(include_comments=True)), 200


# ── Modifier un article ───────────────────────────────────────────────────────

@articles_bp.route('/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(article_id)

    if article.author_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403

    data = request.get_json()
    if 'title'          in data: article.title          = data['title'].strip()
    if 'content'        in data: article.content        = data['content'].strip()
    if 'isPublic'       in data: article.is_public      = data['isPublic']
    if 'allowComments'  in data: article.allow_comments = data['allowComments']

    db.session.commit()
    return jsonify(article.to_dict(include_comments=True)), 200


# ── Supprimer un article ──────────────────────────────────────────────────────

@articles_bp.route('/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(article_id)

    if article.author_id != user_id:
        return jsonify({'error': 'Non autorisé'}), 403

    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': 'Article supprimé'}), 200


# ── Commentaires ──────────────────────────────────────────────────────────────

@articles_bp.route('/<int:article_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(article_id):
    user_id = int(get_jwt_identity())
    article = Article.query.get_or_404(article_id)

    if not article.allow_comments:
        return jsonify({'error': 'Les commentaires sont désactivés'}), 403

    data    = request.get_json()
    content = data.get('content', '').strip()
    if not content:
        return jsonify({'error': 'Le commentaire ne peut pas être vide'}), 400

    comment = Comment(article_id=article_id, author_id=user_id, content=content)
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

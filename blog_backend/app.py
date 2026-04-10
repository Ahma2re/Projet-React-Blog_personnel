from flask import Flask, jsonify
from config.settings import config
from extensions import db, jwt, cors


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r'/api/*': {'origins': 'http://localhost:5173'}})

    # Blueprints
    from routes.auth     import auth_bp
    from routes.articles import articles_bp
    from routes.friends  import friends_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(articles_bp)
    app.register_blueprint(friends_bp)

    # Créer les tables
    with app.app_context():
        db.create_all()
        seed_data(app)

    # Gestion des erreurs JWT
    @jwt.unauthorized_loader
    def unauthorized(reason):
        return jsonify({'error': 'Token manquant ou invalide', 'reason': reason}), 401

    @jwt.expired_token_loader
    def expired(jwt_header, jwt_data):
        return jsonify({'error': 'Token expiré'}), 401

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Ressource introuvable'}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({'error': 'Erreur serveur interne'}), 500

    return app


def seed_data(app):
    """Insère des données de démo si la base est vide."""
    from models.user import User
    from models.article import Article

    if User.query.count() > 0:
        return  

    users_data = [
        ('Ahmady Toure',  'ahma', 'ahma123'),
        ('Youme Lam',    'yuyu',   'yuyu123'),
        ('Boubacar Mandiang',  'boubs', 'boubs123'),
    ]

    users = []
    for full_name, username, password in users_data:
        u = User(full_name=full_name, username=username)
        u.set_password(password)
        db.session.add(u)
        users.append(u)
    db.session.flush()

    articles_data = [
        (users[0], 'Mon premier article',
         'Bienvenue sur mon blog ! Je suis vraiment content de vous partager mes pensées.',
         True, True),
        (users[0], 'Mes pensées privées',
         'Premier article privé, My eyes Only😂.',
         False, False),
        (users[1], 'La vlog de Youme',
         'Entre les cours, les galères… mais aussi les rêves.On avance doucement, mais sûrement',
         True, True),
        (users[2], 'Présentation',
         'Bonjour guys je suis votre prof de react passionner de foot et de manga. Malheureusement je suis tomber amoureux du Barca et ca fait mall 😭',
         True, True),
    ]

    for author, title, content, is_public, allow_comments in articles_data:
        a = Article(author=author, title=title, content=content,
                    is_public=is_public, allow_comments=allow_comments)
        db.session.add(a)

    db.session.commit()
    print('✅ Données de démo insérées (ahma/ahma123, yuyu/yuyu123, boubs/boubs123)')

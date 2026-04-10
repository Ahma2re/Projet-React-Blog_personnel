from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id          = db.Column(db.Integer, primary_key=True)
    full_name   = db.Column(db.String(120), nullable=False)
    username    = db.Column(db.String(80), unique=True, nullable=False)
    password    = db.Column(db.String(256), nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    articles    = db.relationship('Article', backref='author', lazy=True, cascade='all, delete-orphan')
    sent_requests    = db.relationship('Friendship', foreign_keys='Friendship.requester_id', backref='requester', lazy=True)
    received_requests = db.relationship('Friendship', foreign_keys='Friendship.receiver_id', backref='receiver', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'fullName': self.full_name,
            'username': self.username,
            'createdAt': self.created_at.isoformat()
        }

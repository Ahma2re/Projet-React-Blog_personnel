from extensions import db
from datetime import datetime

class Article(db.Model):
    __tablename__ = 'articles'

    id             = db.Column(db.Integer, primary_key=True)
    author_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title          = db.Column(db.String(200), nullable=False)
    content        = db.Column(db.Text, nullable=False)
    is_public      = db.Column(db.Boolean, default=True)
    allow_comments = db.Column(db.Boolean, default=True)
    created_at     = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at     = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    comments       = db.relationship('Comment', backref='article', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_comments=False):
        data = {
            'id': self.id,
            'authorId': self.author_id,
            'authorName': self.author.username if self.author else '',
            'authorFullName': self.author.full_name if self.author else '',
            'title': self.title,
            'content': self.content,
            'isPublic': self.is_public,
            'allowComments': self.allow_comments,
            'createdAt': self.created_at.strftime('%Y-%m-%d'),
            'commentsCount': len(self.comments)
        }
        if include_comments:
            data['comments'] = [c.to_dict() for c in self.comments]
        return data


class Comment(db.Model):
    __tablename__ = 'comments'

    id          = db.Column(db.Integer, primary_key=True)
    article_id  = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    author_id   = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content     = db.Column(db.Text, nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    author      = db.relationship('User', backref='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'articleId': self.article_id,
            'authorId': self.author_id,
            'authorName': self.author.username if self.author else '',
            'content': self.content,
            'createdAt': self.created_at.strftime('%Y-%m-%d')
        }

from extensions import db
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    commenter = db.relationship('User', backref='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'articleId': self.article_id,
            'authorId': self.author_id,
            'authorName': self.commenter.username if self.commenter else '',
            'content': self.content,
            'createdAt': self.created_at.strftime('%Y-%m-%d'),
        }

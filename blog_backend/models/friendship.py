from extensions import db
from datetime import datetime

class Friendship(db.Model):
    __tablename__ = 'friendships'

    id           = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id  = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status       = db.Column(db.String(20), default='pending')  # pending | accepted | rejected | blocked
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'requesterId': self.requester_id,
            'receiverId': self.receiver_id,
            'status': self.status,
            'createdAt': self.created_at.isoformat(),
            'requesterName': self.requester.full_name if self.requester else '',
            'requesterUsername': self.requester.username if self.requester else '',
            'receiverName': self.receiver.full_name if self.receiver else '',
            'receiverUsername': self.receiver.username if self.receiver else '',
        }

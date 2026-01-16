from datetime import datetime,timedelta
from typing import Literal




class Plan():
    def __init__(self, name: Literal["none","basico","completo","premium",] ,buyAt:datetime, duration:timedelta):
        self.name = name
        self.buyAt = buyAt
        self.duration = duration
        self.expireAt = buyAt + duration
    def isExpired(self):
        now = datetime.now()
        return True if (self.expireAt - now).total_seconds() < 0 else False

class User:
    def __init__(
        self,
        un: str,
        pw: str,
        role: Literal['user', 'admin'],
        plans: list['Plan']
    ):
        if not isinstance(un, str):
            raise TypeError("Username must be str")

        if not isinstance(pw, str):
            raise TypeError("Password must be str")

        if role not in ('user', 'admin'):
            raise ValueError("Role must be 'user' or 'admin'")

        if not isinstance(plans, list):
            raise TypeError("Plans must be a list")

        if not all(isinstance(p, Plan) for p in plans):
            raise TypeError("All items in plans must be Plan instances")
        
        self.username = un
        self.password = pw
        self.role = role
        self.plans = plans
    
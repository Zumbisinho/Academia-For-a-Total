import sqlite3
import re
import secrets
import bcrypt
from typing import Literal
from datetime import datetime, timedelta

Gconn = sqlite3.connect('database/users.db')
Gcursor = Gconn.cursor()

def gen_token():
    return secrets.token_urlsafe(32)


class Regex():
    '''
    Class to check if Username, Email and Password are valid to be added to database
    '''
    def __init__(self) -> None:
        self.username = r"^[A-Za-z0-9_]{1,20}$"
        self.password = r"^(?=.*[A-Za-z])(?=.*\d).{8,}$"
        self.email = r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
    def checkUsername(self,usr: str) -> bool:
        if re.fullmatch(self.username,usr): 
            return True 
        return False
    def checkPassword(self,pw: str) -> bool:
        if re.fullmatch(self.username,pw): 
            return True 
        return False
    def checkEmail(self,email: str) -> bool:
        if re.fullmatch(self.email,email): 
            return True 
        return False
    def checkAll(self,usr:str,pw:str,email:str):
        if self.checkUsername(usr) and self.checkPassword(pw) and self.checkEmail(email):
            return True
        return False
Regexs = Regex()
def Status(code,text):
    returnto = {"status":code,"msg":text}
    return returnto
Gcursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    plan TEXT DEFAULT 'none',
    plan_expires DATETIME DEFAULT NULL)
                
""")
Gcursor.execute("""
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY NOT NULL,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);""")


def register(un:str,email:str,pw:str):
    conn = sqlite3.connect('database/users.db')
    cursor = conn.cursor()
    '''
    Create user in database if all parameters are valid, return Created or Error
    '''
    un,email,pw = un.strip(),email.strip(),pw.strip()
    if not Regexs.checkAll(un,pw,email):
        return Status(400,"Parameters didn't pass on regex")
    
    cursor.execute(
        """ 
        SELECT
            EXISTS (SELECT 1 FROM users WHERE username = ?) AS username_exists,
            EXISTS (SELECT 1 FROM users WHERE email = ?)    AS email_exists
        """,
        (un, email)
    )

    username_exists, email_exists = cursor.fetchone()

    if username_exists:
        return Status(4090, "Esse Nome de usuário já usado!")

    if email_exists:
        return Status(4091, "Esse Email já foi registrado!")
    # Passou verificação de regex e existencia, aqui seria uma verificação via email, onde seria enviado um email com um código para confirmar, usando a lib email e smtplib
    
    __secure_pw = bcrypt.hashpw(bytes(pw,encoding='UTF-8'),bcrypt.gensalt(16))
    expires = datetime.now() + timedelta(days=7)
    token = gen_token()
    cursor.execute('''
    INSERT INTO users (username, email, password)
        VALUES (?, ?, ?) ''',(un,email,__secure_pw))
    cursor.execute('''
    INSERT INTO sessions (token, user_id, expires_at)
        VALUES (?, ?, ?) ''',(token,cursor.lastrowid,expires))
    conn.commit()
    return Status(201,{'token':token,'username':un})
    
def login(input:str,pw:str):
    conn = sqlite3.connect('database/users.db')
    cursor = conn.cursor()
    hashpw = None
    userId = -1
    username = ''
    try:
        if input.find('@') != -1:
            hashpw,userId,username = cursor.execute("SELECT password, id, username FROM users WHERE email = ?",(input,)).fetchone()
        else:
            hashpw,userId,username = cursor.execute("SELECT password, id, username FROM users WHERE username = ?",(input,)).fetchone()
        if bcrypt.checkpw(bytes(pw,encoding='UTF-8'),hashpw):
            token = cursor.execute("SELECT token FROM sessions WHERE user_id = ?",(userId,)).fetchone()[0]
            return Status(202,{'token':token,'username':username})
        return Status(401,"Email/Nome ou senha estão incorretos!")
    except Exception as e:
        return Status(401,"Email/Nome ou senha estão incorretos!")
PlanList = ['none','básico','completo','premium']
def change_plan(plan: Literal['none','básico','completo','premium'],token):
    if plan not in PlanList:
        return Status(405,"Plan doesn't exist")
    conn = sqlite3.connect('database/users.db')
    cursor = conn.cursor()
    currentPlan = cursor.execute('SELECT plan FROM users WHERE id = (SELECT user_id FROM sessions WHERE token = ?)',(token,)).fetchone()[0]
    def CompareOldVsNewPlan(old,new) -> bool:
        if PlanList.index(old) < PlanList.index(new):
            return True
        return False
    if CompareOldVsNewPlan(currentPlan,plan):
        cursor.execute('UPDATE users SET plan = ?, plan_expires = ? WHERE id = (SELECT user_id FROM sessions WHERE token = ?)',(plan,datetime.now() + timedelta(days=30),token))
        conn.commit()
        
        return Status(202,'Plan Updated!')
    return Status(409,'You cannot subscribe to the same/worse plan!')
def delete(token):
    if token == None:
        return Status(401,'Not Logged In!')
    conn = sqlite3.connect('database/users.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE id = (SELECT user_id FROM sessions WHERE token = ?)',(token,))
    cursor.execute('DELETE FROM sessions WHERE token = ?',(token,))
    conn.commit()
    if cursor.rowcount == 0:
        return Status(401,'Not Logged In!')
    if cursor.rowcount > 2:
        print('Deu fezes')
    return Status(202,'Account deleted!')
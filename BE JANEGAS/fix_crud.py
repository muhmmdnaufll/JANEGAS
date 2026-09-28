filepath = 'd:/JANEGAS/BE JANEGAS/app/crud/crud.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_block = '''from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import date
from typing import Optional, List
from app.models import models
from app.schemas import schemas

pwd_context = CryptContext(schemes=[ bcrypt], deprecated=auto)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)'''

new_block = '''from sqlalchemy.orm import Session
import bcrypt
from datetime import date
from typing import Optional, List
from app.models import models
from app.schemas import schemas

def get_password_hash(password: str) -> str:
    pw_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pw_bytes = plain_password.encode('utf-8')[:72]
        return bcrypt.checkpw(pw_bytes, hashed_password.encode('utf-8'))
    except Exception:
        return False'''

if old_block in content:
    content = content.replace(old_block, new_block, 1)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(crud.py successfully updated to use bcrypt directly!)
else:
    print(old_block not found checking...)

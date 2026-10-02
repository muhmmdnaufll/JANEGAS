import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from app.core.config import settings

ALGORITHM = "HS256"

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a cryptographically signed standard JWT access token.
    Payload includes subject (user_id), username, role, issued-at (iat), and expiry (exp).
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    })
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and validates a JWT token.
    Also provides a graceful fallback for legacy tokens formatted as 'janegas_token_{id}_{role}'.
    """
    if not token:
        return None

    # Clean Bearer prefix if present
    token_str = token.strip()
    if token_str.lower().startswith("bearer "):
        token_str = token_str[7:].strip()

    # 1. Standard JWT validation
    try:
        payload = jwt.decode(token_str, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise
    except jwt.PyJWTError:
        pass

    # 2. Graceful fallback for legacy token format (janegas_token_{id}_{role})
    parts = token_str.split("_")
    if len(parts) >= 4 and parts[0] == "janegas" and parts[1] == "token":
        try:
            user_id = int(parts[2])
            role = parts[3]
            return {
                "sub": str(user_id),
                "user_id": user_id,
                "role": role,
                "is_legacy": True
            }
        except (ValueError, IndexError):
            pass

    return None

from pydantic import BaseModel

class User(BaseModel):
    id: int
    nik: str
    role: str
    iat: int
    exp: int

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class VariableBase(BaseModel):
    key: str
    value: str

class VariableCreate(VariableBase):
    pass

class Variable(VariableBase):
    id: int
    environment_id: int
    class Config:
        orm_mode = True
        from_attributes = True

class EnvironmentBase(BaseModel):
    name: str

class EnvironmentCreate(EnvironmentBase):
    variables: List[VariableCreate] = []

class Environment(EnvironmentBase):
    id: int
    variables: List[Variable] = []
    class Config:
        from_attributes = True

class RequestItemBase(BaseModel):
    name: str
    method: str
    url: str
    headers: str
    body_type: str
    body: str

class RequestItemCreate(RequestItemBase):
    collection_id: Optional[int] = None

class RequestItem(RequestItemBase):
    id: int
    collection_id: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

class CollectionBase(BaseModel):
    name: str

class CollectionCreate(CollectionBase):
    pass

class Collection(CollectionBase):
    id: int
    requests: List[RequestItem] = []
    class Config:
        from_attributes = True

class HistoryItemBase(BaseModel):
    method: str
    url: str
    headers: str
    body: str
    response_status: int
    response_time: int
    response_size: int

class HistoryItemCreate(HistoryItemBase):
    pass

class HistoryItem(HistoryItemBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
        
class ProxyRequest(BaseModel):
    method: str
    url: str
    headers: dict
    body: Optional[str] = None

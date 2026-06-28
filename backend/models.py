from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Collection(Base):
    __tablename__ = "collections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    requests = relationship("RequestItem", back_populates="collection")

class RequestItem(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=True)
    name = Column(String)
    method = Column(String)
    url = Column(String)
    headers = Column(Text) # JSON string
    body_type = Column(String)
    body = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("Collection", back_populates="requests")

class HistoryItem(Base):
    __tablename__ = "history"
    id = Column(Integer, primary_key=True, index=True)
    method = Column(String)
    url = Column(String)
    headers = Column(Text)
    body = Column(Text)
    response_status = Column(Integer)
    response_time = Column(Integer) # ms
    response_size = Column(Integer) # bytes
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Environment(Base):
    __tablename__ = "environments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    variables = relationship("Variable", back_populates="environment")

class Variable(Base):
    __tablename__ = "variables"
    id = Column(Integer, primary_key=True, index=True)
    environment_id = Column(Integer, ForeignKey("environments.id"))
    key = Column(String)
    value = Column(String)

    environment = relationship("Environment", back_populates="variables")

from sqlalchemy.orm import Session
import models, schemas

def get_collections(db: Session):
    return db.query(models.Collection).all()

def create_collection(db: Session, collection: schemas.CollectionCreate):
    db_col = models.Collection(name=collection.name)
    db.add(db_col)
    db.commit()
    db.refresh(db_col)
    return db_col

def create_request(db: Session, req: schemas.RequestItemCreate, collection_id: int = None):
    db_req = models.RequestItem(**req.model_dump())
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

def get_history(db: Session):
    return db.query(models.HistoryItem).order_by(models.HistoryItem.created_at.desc()).limit(100).all()

def create_history(db: Session, hist: schemas.HistoryItemCreate):
    db_hist = models.HistoryItem(**hist.model_dump())
    db.add(db_hist)
    db.commit()
    db.refresh(db_hist)
    return db_hist

def get_environments(db: Session):
    return db.query(models.Environment).all()

def create_environment(db: Session, env: schemas.EnvironmentCreate):
    db_env = models.Environment(name=env.name)
    db.add(db_env)
    db.commit()
    db.refresh(db_env)
    for var in env.variables:
        db_var = models.Variable(key=var.key, value=var.value, environment_id=db_env.id)
        db.add(db_var)
    db.commit()
    db.refresh(db_env)
    return db_env

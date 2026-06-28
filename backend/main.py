from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, crud, schemas, database
import httpx
import time
import json

app = FastAPI(title="Postman Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

@app.get("/collections", response_model=list[schemas.Collection])
def read_collections(db: Session = Depends(database.get_db)):
    return crud.get_collections(db)

@app.post("/collections", response_model=schemas.Collection)
def create_collection(collection: schemas.CollectionCreate, db: Session = Depends(database.get_db)):
    return crud.create_collection(db, collection)

@app.post("/requests", response_model=schemas.RequestItem)
def create_request(req: schemas.RequestItemCreate, db: Session = Depends(database.get_db)):
    return crud.create_request(db, req)

@app.get("/history", response_model=list[schemas.HistoryItem])
def read_history(db: Session = Depends(database.get_db)):
    return crud.get_history(db)

@app.get("/environments", response_model=list[schemas.Environment])
def read_environments(db: Session = Depends(database.get_db)):
    return crud.get_environments(db)

@app.post("/environments", response_model=schemas.Environment)
def create_environment(env: schemas.EnvironmentCreate, db: Session = Depends(database.get_db)):
    return crud.create_environment(db, env)

@app.post("/proxy")
async def proxy_request(proxy_req: schemas.ProxyRequest, db: Session = Depends(database.get_db)):
    # Runner proxy to avoid CORS
    start_time = time.time()
    try:
        async with httpx.AsyncClient() as client:
            safe_headers = {k: v for k, v in proxy_req.headers.items() if k.lower() not in ["host", "origin", "referer", "content-length"]}
            
            response = await client.request(
                method=proxy_req.method,
                url=proxy_req.url,
                headers=safe_headers,
                content=proxy_req.body.encode('utf-8') if proxy_req.body else None,
                timeout=15.0
            ) 
        
        elapsed_ms = int((time.time() - start_time) * 1000)
        
        # Save to history automatically
        hist_in = schemas.HistoryItemCreate(
            method=proxy_req.method,
            url=proxy_req.url,
            headers=json.dumps(proxy_req.headers),
            body=proxy_req.body or "",
            response_status=response.status_code,
            response_time=elapsed_ms,
            response_size=len(response.content)
        )
        crud.create_history(db, hist_in)

        res_headers = {k: v for k, v in response.headers.items()}
        content_type = res_headers.get("content-type", "")
        
        if "application/json" in content_type:
            try:
                body_data = response.json()
            except:
                body_data = response.text
        else:
            body_data = response.text

        return {
            "status": response.status_code,
            "time": elapsed_ms,
            "size": len(response.content),
            "headers": res_headers,
            "data": body_data
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

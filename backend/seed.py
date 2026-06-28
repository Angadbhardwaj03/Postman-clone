import datetime
from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if db.query(models.Environment).first():
    print("Database already seeded")
    db.close()
    exit(0)

# Environments
env1 = models.Environment(name="Local Environment")
env2 = models.Environment(name="Production Environment")
db.add(env1)
db.add(env2)
db.commit()

# Variables
var1 = models.Variable(environment_id=env1.id, key="base_url", value="https://httpbin.org")
var2 = models.Variable(environment_id=env2.id, key="base_url", value="https://jsonplaceholder.typicode.com")
db.add_all([var1, var2])
db.commit()

# Collections
col1 = models.Collection(name="HTTPBin Tests")
col2 = models.Collection(name="JSON Placeholder")
db.add(col1)
db.add(col2)
db.commit()

# History
hist1 = models.HistoryItem(
    method="GET",
    url="https://httpbin.org/get",
    headers="{\"Accept\": \"*/*\"}",
    body="",
    response_status=200,
    response_time=142,
    response_size=520
)
hist2 = models.HistoryItem(
    method="POST",
    url="https://httpbin.org/post",
    headers="{\"Content-Type\": \"application/json\"}",
    body="{\"hello\": \"world\"}",
    response_status=200,
    response_time=215,
    response_size=712
)
db.add_all([hist1, hist2])
db.commit()

print("Database seeded successfully!")
db.close()

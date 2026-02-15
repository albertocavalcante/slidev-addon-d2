---
addons:
  - .
---

# D2 Diagrams in Slidev

Native D2 diagram support via fenced code blocks

---

## Simple Architecture

```d2
user: User {shape: person}
api: API Server
db: PostgreSQL {shape: cylinder}
cache: Redis

user -> api: HTTPS
api -> db: SQL
api -> cache: get/set
```

---

## Sketch Mode

```d2 {sketch: true}
laptop: Laptop
cloud: Cloud {shape: cloud}
phone: Phone

laptop -> cloud: sync
phone -> cloud: sync
cloud -> laptop: push
```

---

## ELK Layout + Theme

```d2 {layout: 'elk', theme: 5}
cloud: AWS {
  vpc: VPC {
    subnet: Private Subnet {
      api: API Server
      db: RDS {shape: cylinder}
      worker: Worker
    }
  }
  cdn: CloudFront
  s3: S3 {shape: cylinder}
}

user: User {shape: person}
user -> cloud.cdn: HTTPS
cloud.cdn -> cloud.vpc.subnet.api
cloud.vpc.subnet.api -> cloud.vpc.subnet.db: SQL
cloud.vpc.subnet.api -> cloud.s3: upload
cloud.vpc.subnet.worker -> cloud.vpc.subnet.db: poll
```

---

## Sequence Diagram

```d2
shape: sequence_diagram

alice: Alice
bob: Bob
server: Server

alice -> bob: Hey Bob
bob -> server: Check status
server -> bob: All good
bob -> alice: Everything's fine!
```

---

## Dark Theme

```d2 {theme: 200}
frontend: React App
backend: Go API
db: PostgreSQL {shape: cylinder}
queue: RabbitMQ {shape: queue}

frontend -> backend: GraphQL
backend -> db: queries
backend -> queue: publish
queue -> backend: consume
```

---

## Containers & Styling

```d2
direction: right

network: Network Layer {
  lb: Load Balancer
  fw: Firewall
}

app: Application Layer {
  web: Web Server
  api: API Server
  ws: WebSocket
}

data: Data Layer {
  primary: Primary DB {shape: cylinder}
  replica: Replica DB {shape: cylinder}
  cache: Redis
}

network.lb -> app.web
network.lb -> app.api
app.web -> data.cache
app.api -> data.primary
data.primary -> data.replica: replication {style.stroke-dash: 5}
```

# Learners High Rewards API

Spring Boot + MySQL API for the rewards tablet prototype.

## Run locally

Create/use a MySQL database user, then run the server with the password in an environment variable:

```bash
export DB_USERNAME=root
export DB_PASSWORD='your_mysql_password'
cd server
gradle bootRun
```

The default JDBC URL creates `learners_high_rewards` automatically when the MySQL user has permission:

```text
jdbc:mysql://localhost:3306/learners_high_rewards?createDatabaseIfNotExist=true
```

If Gradle is not installed locally:

```bash
brew install gradle
```

## Demo User

Until real auth is added, the API uses the `X-Demo-User` header. If omitted, it uses `demo-dain`.

```bash
curl -H 'X-Demo-User: demo-dain' http://localhost:8080/api/me/state
```

## Main Endpoints

- `GET /api/me/state`: shards, streak, shields, daily claim status, pending BIG spin
- `POST /api/demo/reset`: resets the demo user with dummy logs, inventory, shards, and unclaimed daily reward
- `GET /api/study/summary`: current-date study summary for the home screen
- `POST /api/rewards/daily/claim`: server-side daily reward draw; rejects duplicate claims
- `POST /api/rewards/big/spin`: server-side BIG draw; requires pending BIG entry
- `GET /api/rewards/logs`: recent reward logs
- `GET /api/shop/items`: active shop items with stock/sold status
- `POST /api/shop/exchange`: validates stock and shard balance, then exchanges
- `GET /api/shop/exchange-logs`: exchange logs
- `GET /api/inventory`: user inventory
- `POST /api/inventory/{id}/use`: marks one coupon as used
- `POST /api/shields/use`: consumes one shield and marks today as shield-protected
- `GET /api/hall/winners`: BIG winners
- `GET /api/hall/stats`: this-month BIG winner count
- `GET /api/admin/reward-pool`: reward pool weights/activation
- `PATCH /api/admin/reward-pool/{id}`: update `weight`, `active`
- `GET /api/admin/shop-items`: shop item settings
- `PATCH /api/admin/shop-items/{id}`: update `price`, `stock`, `active`

## Example Requests

```bash
curl -X POST -H 'X-Demo-User: demo-dain' http://127.0.0.1:8080/api/demo/reset
```

```bash
curl -X POST -H 'Content-Type: application/json' \
  -H 'X-Demo-User: demo-dain' \
  -d '{"reflection":"오늘도 2시간 달성"}' \
  http://localhost:8080/api/rewards/daily/claim
```

```bash
curl -X POST -H 'Content-Type: application/json' \
  -H 'X-Demo-User: demo-dain' \
  -d '{"item_id":1}' \
  http://localhost:8080/api/shop/exchange
```

```bash
curl -X PATCH -H 'Content-Type: application/json' \
  -d '{"weight":20,"active":true}' \
  http://localhost:8080/api/admin/reward-pool/7
```

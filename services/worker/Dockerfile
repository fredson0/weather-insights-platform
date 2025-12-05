FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copiar go mod files
COPY go.mod ./
RUN go mod download

# Copiar código
COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o worker ./cmd/worker

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/worker .

CMD ["./worker"]

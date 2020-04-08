FROM golang:1.12-alpine3.9

RUN apk add --no-cache git make
RUN go get -u github.com/go-chi/chi
RUN go get -u github.com/lib/pq
RUN go get -u github.com/go-chi/chi/middleware
RUN go get -u github.com/go-chi/cors

COPY ./ /go/speedrun-1st/src

CMD ["sh", "-c", "cd /go/speedrun-1st/src/cmd && go run main.go"]

EXPOSE 8080
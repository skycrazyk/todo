FROM denoland/deno:2.6.6 as builder
WORKDIR /app

# Cache the dependency installation step
COPY ./deno.json ./deno.lock ./
COPY ./shared/deno.json ./shared/
COPY ./frontend/deno.json ./frontend/ 
COPY ./backend/deno.json ./backend/deno.lock ./backend/ 

RUN cd ./frontend && deno install 

COPY ./shared/ ./shared/
COPY ./backend/ ./backend/
COPY ./frontend/ ./frontend/

RUN cd ./frontend && deno task check:ts && deno task build

FROM nginx:alpine AS runner
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD nginx -g 'daemon off;'

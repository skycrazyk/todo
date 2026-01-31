FROM denoland/deno:2.6.6

EXPOSE 8000 

WORKDIR /app

# Cache the dependency installation step
COPY ./deno.json ./deno.lock ./
COPY ./shared/deno.json ./shared/
COPY ./frontend/deno.json ./frontend/ 
COPY ./backend/deno.json ./backend/deno.lock ./backend/ 

RUN cd ./backend && deno install 

COPY ./shared/ ./shared/
COPY ./backend/ ./backend/

# Warm up to cache native dependencies (sqlite for example)
RUN cd ./backend && deno run -A warmup.ts

WORKDIR /app/backend

CMD ["deno", "serve", "--env-file", "-A", "main.ts"]

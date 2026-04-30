# Stage 1: Prep Environment (Builder)
FROM alpine:latest AS builder
WORKDIR /app
# Copy project files
COPY . .
# Clean up any non-essential files before transferring to the final image
RUN rm -rf .git Dockerfile README.md

# Stage 2: Production Server (Optimized for Cloud Run)
FROM nginx:alpine-slim

# Copy the custom Nginx configuration optimized for port 8080
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the necessary static files from the builder stage
COPY --from=builder /app/index.html /usr/share/nginx/html/
COPY --from=builder /app/style.css /usr/share/nginx/html/
COPY --from=builder /app/js/ /usr/share/nginx/html/js/
COPY --from=builder /app/tests/ /usr/share/nginx/html/tests/

# Expose port 8080 as required by Cloud Run
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

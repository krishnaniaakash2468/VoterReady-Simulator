# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the static HTML, CSS, and JS files to the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY tests/ /usr/share/nginx/html/tests/

# Copy custom Nginx configuration if needed (optional, but good for Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run requires 8080 by default)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

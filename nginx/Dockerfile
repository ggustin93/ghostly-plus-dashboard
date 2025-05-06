FROM nginx:stable-alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom configuration file
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 
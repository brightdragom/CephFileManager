# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install Tailwind CSS dependencies
#RUN npm install tailwindcss postcss autoprefixer --save-dev

# Copy the rest of the application files
COPY . .

# Initialize Tailwind (ensure it's available globally)
#RUN tailwindcss init -p

# Expose the port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]

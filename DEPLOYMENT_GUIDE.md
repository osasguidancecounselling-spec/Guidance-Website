# Deployment Guide for Guidance Counseling App on Render

This guide will help you deploy the Guidance Counseling App to Render successfully.

## Prerequisites

1. A Render.com account
2. A MongoDB Atlas database (or other MongoDB provider)
3. GitHub repository with your code

## Step 1: Environment Variables Setup

Before deploying, you need to set up the following environment variables in the Render Dashboard:

### Backend Service Environment Variables:
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT token generation
- `NODE_ENV`: Set to `production`
- `CLIENT_URL`: Will be automatically set by Render (from the static site service)

### Frontend Service Environment Variables:
- `VITE_API_URL`: The URL of your deployed backend API service

## Step 2: Render Dashboard Setup

1. **Connect your GitHub repository** to Render
2. **Create a new Blueprint** using the `render.yaml` file
3. **Set environment variables** in the Render Dashboard for both services

## Step 3: Manual Environment Variable Configuration

After the services are created in Render, you must manually set the following environment variables:

### For the Backend Service (`guidance-counseling-api`):
1. Go to your service dashboard
2. Click on "Environment" in the left sidebar
3. Add the following variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string for JWT
   - `NODE_ENV`: `production`

### For the Frontend Service (`guidance-counseling-client`):
1. Go to your static site dashboard
2. Click on "Environment" in the left sidebar
3. Add the following variable:
   - `VITE_API_URL`: The URL of your backend API service (e.g., `https://your-api-service.onrender.com`)

## Step 4: Verify Deployment

1. **Check build logs** for any errors during deployment
2. **Verify health check**: Visit `/api/health` endpoint of your backend
3. **Test the application**: Open your frontend URL and test the functionality

## File Structure Changes Made for Deployment

1. **Created necessary directories**: `outputs/forms`, `uploads`, `submitted`, `answered_pdfs`
2. **Added directory creation script**: `server/create-dirs.js`
3. **Updated build command**: Now runs `npm install && npm run create-dirs`
4. **Enhanced server.js**: Gracefully handles missing static directories
5. **Simplified render.yaml**: Removed complex service references for better compatibility

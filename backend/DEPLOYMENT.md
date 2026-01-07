# Deployment Guide for Render

## Prerequisites

1. GitHub repository with your code
2. Render account (sign up at https://render.com)
3. OpenAI API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

All necessary files are already in place:
- `render.yaml` - Render configuration
- `Procfile` - Process file for Render
- `requirements.txt` - Python dependencies
- `build.sh` - Build script

### 2. Deploy on Render

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `Aditiya_Saini`

3. **Configure the Service**
   - **Name**: `portfolio-chatbot-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Root Directory**: `backend`
   - **Build Command**: `./build.sh` or `pip install -r requirements.txt && python initialize_knowledge_base.py`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   Click on "Environment" tab and add:
   - `OPENAI_API_KEY` = `your_openai_api_key_here`
   - `CORS_ORIGINS` = `https://aditiya1.github.io,https://aditiya1.github.io/Aditiya_Saini`
   - `PORT` = `10000` (optional, Render sets this automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait for deployment to complete (first deploy takes ~5-10 minutes)

### 3. Get Your Backend URL

After deployment, Render will provide a URL like:
- `https://portfolio-chatbot-backend.onrender.com`

Copy this URL - you'll need it for the frontend.

### 4. Update Frontend Configuration

1. Create `.env` file in the root directory:
   ```
   REACT_APP_API_URL=https://your-app-name.onrender.com
   ```

2. Rebuild and deploy frontend:
   ```bash
   npm run build
   npm run deploy
   ```

### 5. Test the Deployment

1. Visit your backend health endpoint:
   `https://your-app-name.onrender.com/api/health`

2. Test the chatbot on your portfolio website

## Troubleshooting

### Build Fails
- Check that all dependencies are in `requirements.txt`
- Verify Python version in `runtime.txt`
- Check build logs in Render dashboard

### Knowledge Base Not Initializing
- The `initialize_knowledge_base.py` runs during build
- Check that data files exist in `backend/data/`
- Verify OpenAI API key is set correctly

### CORS Errors
- Ensure your frontend URL is in `CORS_ORIGINS`
- Check that `RENDER_EXTERNAL_URL` is being used (it's automatic)
- Verify backend URL matches in frontend `.env`

### Service Spins Down
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- Consider upgrading to paid tier for always-on service

## Free Tier Limitations

- **Spins down** after 15 minutes of inactivity
- **Cold starts** take ~30 seconds
- **750 hours/month** free compute time
- Perfect for portfolio projects!

## Updating the Deployment

Any push to your `main` branch will automatically trigger a new deployment on Render.

## Support

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com


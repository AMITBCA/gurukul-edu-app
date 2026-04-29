@echo off
set PROJECT_ID=directed-mender-478616
set SERVICE_NAME=gurukul-app
set REGION=us-central1

echo 🚀 Starting Deployment for Gurukul Edu WebApp...
echo ---------------------------------------------------

:: Step 1: Set GCP Project
echo [1/3] Setting GCP Project...
call gcloud config set project %PROJECT_ID%

:: Step 2: Build and Push Image to Container Registry
echo [2/3] Building and Pushing Docker Image...
call gcloud builds submit --tag gcr.io/%PROJECT_ID%/%SERVICE_NAME%

:: Step 3: Deploy to Cloud Run
echo [3/3] Deploying to Cloud Run...
call gcloud run deploy %SERVICE_NAME% ^
  --image gcr.io/%PROJECT_ID%/%SERVICE_NAME% ^
  --platform managed ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --set-env-vars="NODE_ENV=production"

echo ---------------------------------------------------
echo ✅ Deployment Process Triggered!
echo Check the URL above to see your live website.
echo ⚠️ REMEMBER: Go to Google Cloud Console (Cloud Run -> Variables) to set your MongoDB_URI and other secrets!
pause

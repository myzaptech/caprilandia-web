# Firebase Configuration and Deployment Script

## 1. Install Firebase CLI (if not installed)
```bash
npm install -g firebase-tools
```

## 2. Login to Firebase
```bash
firebase login
```

## 3. Initialize Firebase in project (if not done)
```bash
firebase init
```
- Select "Firestore" and "Storage" 
- Choose existing project: "carilandia-base"
- Use existing firestore.rules and storage.rules files

## 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## 5. Deploy Storage Rules  
```bash
firebase deploy --only storage:rules
```

## 6. Configure CORS for Storage Bucket
```bash
# Install Google Cloud SDK if not installed
# Then run:
gcloud auth login
gsutil cors set cors.json gs://carilandia-base.firebasestorage.app
```

## Alternative CORS Configuration via Firebase CLI
```bash
# Create a temporary cors.json file and apply it
firebase functions:config:set storage.cors='[{"origin":["*"],"method":["GET","POST","PUT","DELETE"],"maxAgeSeconds":3600}]'
```

## 7. Verify Configuration
```bash
# Check Firestore rules
firebase firestore:rules:list

# Check Storage rules  
firebase storage:rules:list

# Check CORS configuration
gsutil cors get gs://carilandia-base.firebasestorage.app
```

## 8. Test from Browser Console
```javascript
// Test Firebase Storage access from browser console
fetch('https://firebasestorage.googleapis.com/v0/b/carilandia-base.firebasestorage.app/o')
  .then(response => response.json())
  .then(data => console.log('✅ Storage accessible:', data))
  .catch(error => console.error('❌ Storage error:', error));
```

## Quick Fix for Development
If you need immediate access for development, temporarily update storage rules to be completely open:

```javascript
// TEMPORARY - DEVELOPMENT ONLY
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ WARNING: Never use open rules in production!**
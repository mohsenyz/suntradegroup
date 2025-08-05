# JSON API Server

Simple PHP server for CMS JSON file storage and retrieval with password authentication.

## Setup

1. **Place files in web server directory**
   ```bash
   # Copy the api folder to your web server
   cp -r api/ /var/www/html/api/
   ```

2. **Set permissions**
   ```bash
   chmod 755 /var/www/html/api/
   chmod 644 /var/www/html/api/index.php
   mkdir -p /var/www/html/api/data
   chmod 755 /var/www/html/api/data
   ```

3. **Test the server**
   ```bash
   curl -X GET "http://localhost/api/" -H "X-Password: suntradegroup2024"
   ```

## API Endpoints

### Authentication
All requests require authentication using one of these methods:
- Header: `X-Password: suntradegroup2024`
- POST parameter: `password=suntradegroup2024`
- GET parameter: `?password=suntradegroup2024`

### GET /api/
List all JSON files
```bash
curl -X GET "http://localhost/api/" -H "X-Password: suntradegroup2024"
```

### GET /api/{filename}
Get specific JSON file
```bash
curl -X GET "http://localhost/api/products" -H "X-Password: suntradegroup2024"
```

### POST /api/
Save/update JSON file
```bash
curl -X POST "http://localhost/api/" \
  -H "Content-Type: application/json" \
  -H "X-Password: suntradegroup2024" \
  -d '{"filename": "products", "data": {"products": []}}'
```

### DELETE /api/{filename}
Delete JSON file
```bash
curl -X DELETE "http://localhost/api/products" -H "X-Password: suntradegroup2024"
```

## Features

- **Password Authentication**: Uses same password as CMS (`suntradegroup2024`)
- **CORS Support**: Allows cross-origin requests
- **Automatic Backups**: Creates backups before overwrites/deletes
- **JSON Validation**: Validates JSON data before saving
- **Error Handling**: Proper HTTP status codes and error messages

## File Structure

```
api/
├── index.php          # Main API server
├── data/              # JSON files storage
│   ├── products.json
│   ├── texts-common.json
│   ├── texts-pages.json
│   ├── texts-forms.json
│   └── backups/       # Automatic backups
└── README.md          # This file
```

## Security Notes

- Change the default password in production
- Consider using HTTPS in production
- Restrict access to `/api/data/` directory via .htaccess
- Regular backup of the `data/` directory is recommended
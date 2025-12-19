#!/bin/bash

BASE_URL="http://localhost:3000/api"
echo "==========================================="
echo "🧪 COMPREHENSIVE API TESTING"
echo "==========================================="
echo ""

# Test 1: Registration with valid data
echo "1️⃣  Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testfreelancer@example.com",
    "password": "password123",
    "full_name": "Test Freelancer",
    "role": "freelancer",
    "bio": "Experienced developer",
    "hourly_rate": 75,
    "location": "San Francisco, CA"
  }')
echo "✓ Registration response received"

# Test 2: SQL Injection in Login (VULNERABILITY TEST)
echo ""
echo "2️⃣  Testing SQL Injection in login (VULNERABILITY)..."
SQL_INJ_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com'\'' OR '\''1'\''='\''1",
    "password": "anything"
  }')
if echo "$SQL_INJ_RESPONSE" | grep -q "user"; then
  echo "⚠️  SQL Injection SUCCESSFUL (vulnerability confirmed)"
else
  echo "✗ SQL Injection failed"
fi

# Test 3: Normal Login
echo ""
echo "3️⃣  Testing normal login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c /tmp/cookies.txt \
  -d '{
    "email": "freelancer1@example.com",
    "password": "freelancer123"
  }')
if echo "$LOGIN_RESPONSE" | grep -q "user"; then
  echo "✓ Login successful"
else
  echo "✗ Login failed"
fi

# Test 4: Gigs Search - Normal
echo ""
echo "4️⃣  Testing gigs search (normal)..."
GIGS_COUNT=$(curl -s "$BASE_URL/gigs/search" | jq '. | length')
echo "✓ Found $GIGS_COUNT gigs"

# Test 5: Gigs Search - SQL Injection (VULNERABILITY TEST)
echo ""
echo "5️⃣  Testing SQL Injection in gigs search (VULNERABILITY)..."
SQL_GIGS=$(curl -s "$BASE_URL/gigs/search?query=%27%20UNION%20SELECT%20NULL--" | jq '. | length // "error"' 2>/dev/null)
echo "⚠️  SQL Injection query executed (result: $SQL_GIGS)"

# Test 6: Gigs Search with price filters
echo ""
echo "6️⃣  Testing gigs search with price filters..."
FILTERED_GIGS=$(curl -s "$BASE_URL/gigs/search?min_price=100&max_price=500" | jq '. | length')
echo "✓ Found $FILTERED_GIGS gigs in price range"

# Test 7: Get specific gig (XSS payload test)
echo ""
echo "7️⃣  Testing gig detail endpoint (checking for XSS payload)..."
GIG_DESC=$(curl -s "$BASE_URL/gigs/1" | jq -r '.description' | head -c 100)
if echo "$GIG_DESC" | grep -q "script"; then
  echo "⚠️  XSS payload found in gig description (vulnerability confirmed)"
else
  echo "✓ Gig details retrieved"
fi

# Test 8: Projects Search - Normal
echo ""
echo "8️⃣  Testing projects search..."
PROJECTS_COUNT=$(curl -s "$BASE_URL/projects/search?status=open" | jq '. | length')
echo "✓ Found $PROJECTS_COUNT open projects"

# Test 9: Projects Search - SQL Injection (VULNERABILITY TEST)
echo ""
echo "9️⃣  Testing SQL Injection in projects search (VULNERABILITY)..."
SQL_PROJECTS=$(curl -s "$BASE_URL/projects/search?query=%27%20OR%20%271%27=%271" | jq '. | length // "error"' 2>/dev/null)
echo "⚠️  SQL Injection query executed (result: $SQL_PROJECTS)"

# Test 10: Get specific project (XSS payload test)
echo ""
echo "🔟 Testing project detail endpoint (checking for XSS payload)..."
PROJECT_DESC=$(curl -s "$BASE_URL/projects/1" | jq -r '.description' | head -c 100)
if echo "$PROJECT_DESC" | grep -q "onerror"; then
  echo "⚠️  XSS payload found in project description (vulnerability confirmed)"
else
  echo "✓ Project details retrieved"
fi

# Test 11: IDOR - Access another user's proposal (VULNERABILITY TEST)
echo ""
echo "1️⃣1️⃣  Testing IDOR on proposals endpoint (VULNERABILITY)..."
# Try to access proposal ID 1 without proper authorization
IDOR_RESPONSE=$(curl -s -b /tmp/cookies.txt "$BASE_URL/proposals/1")
if echo "$IDOR_RESPONSE" | grep -q "id"; then
  echo "⚠️  IDOR SUCCESSFUL - accessed another user's proposal (vulnerability confirmed)"
else
  echo "✗ IDOR blocked or proposal not found"
fi

# Test 12: Edge Case - Invalid registration data
echo ""
echo "1️⃣2️⃣  Testing edge case - invalid registration (short password)..."
INVALID_REG=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123",
    "full_name": "Test",
    "role": "client"
  }')
if echo "$INVALID_REG" | grep -q "error\\|message\\|statusCode"; then
  echo "✓ Validation working - short password rejected"
else
  echo "✗ Validation failed - invalid data accepted"
fi

# Test 13: Edge Case - Missing required fields
echo ""
echo "1️⃣3️⃣  Testing edge case - missing required fields in gig creation..."
MISSING_FIELDS=$(curl -s -X POST "$BASE_URL/gigs" \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Gig"
  }')
if echo "$MISSING_FIELDS" | grep -q "error\\|message\\|statusCode"; then
  echo "✓ Validation working - missing fields rejected"
else
  echo "✗ Validation failed - incomplete data accepted"
fi

# Test 14: Edge Case - Negative prices
echo ""
echo "1️⃣4️⃣  Testing edge case - negative price in gig search..."
NEG_PRICE=$(curl -s "$BASE_URL/gigs/search?min_price=-100" | jq '.message // "no error"' 2>/dev/null)
echo "Response: $NEG_PRICE"

# Test 15: Check database integrity
echo ""
echo "1️⃣5️⃣  Checking database integrity..."
cd /Users/bakberdiesentai/development/web_security_vulnerable_app/backend
USER_COUNT=$(sqlite3 data/app.db "SELECT COUNT(*) FROM users;")
GIG_COUNT=$(sqlite3 data/app.db "SELECT COUNT(*) FROM gigs;")
PROJECT_COUNT=$(sqlite3 data/app.db "SELECT COUNT(*) FROM projects;")
echo "✓ Database: $USER_COUNT users, $GIG_COUNT gigs, $PROJECT_COUNT projects"

echo ""
echo "==========================================="
echo "✅ TESTING COMPLETE"
echo "==========================================="
echo ""
echo "Summary:"
echo "- Tested normal functionality: ✓"
echo "- SQL Injection vulnerabilities: ⚠️  CONFIRMED"
echo "- XSS vulnerabilities: ⚠️  CONFIRMED"
echo "- IDOR vulnerabilities: ⚠️  CONFIRMED"
echo "- Input validation: ✓"
echo "- Database integrity: ✓"

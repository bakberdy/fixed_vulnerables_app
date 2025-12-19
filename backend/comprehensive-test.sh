#!/bin/bash

BASE_URL="http://localhost:3000/api"
COOKIE_FILE="/tmp/test_cookies.txt"
rm -f $COOKIE_FILE

echo "==========================================="
echo "🧪 COMPREHENSIVE API TESTING - ALL ENDPOINTS"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
VULNERABLE=0

# Helper functions
print_test() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "TEST $1: $2"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

print_pass() {
    echo -e "${GREEN}✓ PASS:${NC} $1"
    ((PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL:${NC} $1"
    ((FAILED++))
}

print_vuln() {
    echo -e "${YELLOW}⚠️  VULNERABLE:${NC} $1"
    ((VULNERABLE++))
}

# ============================================
# 1. AUTHENTICATION ENDPOINTS
# ============================================

print_test "1" "POST /api/auth/register - Valid registration"
REGISTER=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newtestuser'$RANDOM'@example.com",
    "password": "testpass123",
    "full_name": "New Test User",
    "role": "freelancer",
    "bio": "Test bio",
    "hourly_rate": 50,
    "location": "Test City"
  }')
HTTP_CODE=$(echo "$REGISTER" | tail -n1)
BODY=$(echo "$REGISTER" | sed '$d')
if [ "$HTTP_CODE" = "201" ] && echo "$BODY" | grep -q "email"; then
    print_pass "User registered successfully (Status: $HTTP_CODE)"
    echo "Response: $(echo $BODY | jq -c '{id, email, role}')"
else
    print_fail "Registration failed (Status: $HTTP_CODE)"
    echo "Response: $BODY"
fi

print_test "2" "POST /api/auth/register - Short password validation"
SHORT_PASS=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "123", "full_name": "Test", "role": "client"}')
HTTP_CODE=$(echo "$SHORT_PASS" | tail -n1)
if [ "$HTTP_CODE" = "400" ]; then
    print_pass "Short password rejected (Status: $HTTP_CODE)"
else
    print_fail "Short password accepted (Status: $HTTP_CODE)"
fi

print_test "3" "POST /api/auth/register - Duplicate email"
DUP_EMAIL=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.dev@example.com", "password": "password123", "full_name": "Test", "role": "freelancer"}')
HTTP_CODE=$(echo "$DUP_EMAIL" | tail -n1)
if [ "$HTTP_CODE" = "400" ]; then
    print_pass "Duplicate email rejected (Status: $HTTP_CODE)"
else
    print_fail "Duplicate email accepted (Status: $HTTP_CODE)"
fi

print_test "4" "POST /api/auth/login - Normal login"
LOGIN=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_FILE \
  -d '{"email": "john.dev@example.com", "password": "freelancer123"}')
HTTP_CODE=$(echo "$LOGIN" | tail -n1)
BODY=$(echo "$LOGIN" | sed '$d')
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q "john.dev"; then
    print_pass "Login successful (Status: $HTTP_CODE)"
    echo "User: $(echo $BODY | jq -c '{id, email, role}')"
else
    print_fail "Login failed (Status: $HTTP_CODE)"
    echo "Response: $BODY"
fi

print_test "5" "POST /api/auth/login - SQL Injection vulnerability"
SQL_INJ=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"admin@platform.com' OR '1'='1\", \"password\": \"anything\"}")
HTTP_CODE=$(echo "$SQL_INJ" | tail -n1)
BODY=$(echo "$SQL_INJ" | sed '$d')
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q "admin"; then
    print_vuln "SQL Injection successful - authenticated without valid password!"
    echo "Bypassed user: $(echo $BODY | jq -c '{email, role}')"
else
    print_pass "SQL Injection blocked (Status: $HTTP_CODE)"
fi

print_test "6" "POST /api/auth/login - Wrong password"
WRONG_PASS=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.dev@example.com", "password": "wrongpassword"}')
HTTP_CODE=$(echo "$WRONG_PASS" | tail -n1)
if [ "$HTTP_CODE" = "401" ]; then
    print_pass "Wrong password rejected (Status: $HTTP_CODE)"
else
    print_fail "Wrong password accepted (Status: $HTTP_CODE)"
fi

print_test "7" "POST /api/auth/logout"
LOGOUT=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/logout" -b $COOKIE_FILE)
HTTP_CODE=$(echo "$LOGOUT" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Logout successful (Status: $HTTP_CODE)"
else
    print_fail "Logout failed (Status: $HTTP_CODE)"
fi

# Re-login for subsequent tests
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_FILE \
  -d '{"email": "john.dev@example.com", "password": "freelancer123"}' > /dev/null

# ============================================
# 2. USER ENDPOINTS
# ============================================

print_test "8" "GET /api/users/me"
ME=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/users/me")
HTTP_CODE=$(echo "$ME" | tail -n1)
BODY=$(echo "$ME" | sed '$d')
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q "john.dev"; then
    print_pass "Get current user successful (Status: $HTTP_CODE)"
    echo "User: $(echo $BODY | jq -c '{id, email, full_name}')"
else
    print_fail "Get current user failed (Status: $HTTP_CODE)"
fi

print_test "9" "GET /api/users/:id/profile"
PROFILE=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/users/2/profile")
HTTP_CODE=$(echo "$PROFILE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get user profile successful (Status: $HTTP_CODE)"
    echo "Profile: $(echo $PROFILE | sed '$d' | jq -c '{full_name, role, rating}')"
else
    print_fail "Get user profile failed (Status: $HTTP_CODE)"
fi

print_test "10" "PUT /api/users/:id/profile"
UPDATE_PROFILE=$(curl -s -w "\n%{http_code}" -X PUT -b $COOKIE_FILE "$BASE_URL/users/2/profile" \
  -H "Content-Type: application/json" \
  -d '{"bio": "Updated bio for testing", "hourly_rate": 85}')
HTTP_CODE=$(echo "$UPDATE_PROFILE" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Update profile successful (Status: $HTTP_CODE)"
else
    print_fail "Update profile failed (Status: $HTTP_CODE)"
fi

print_test "11" "GET /api/users/:id/stats"
STATS=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/users/2/stats")
HTTP_CODE=$(echo "$STATS" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get user stats successful (Status: $HTTP_CODE)"
    echo "Stats: $(echo $STATS | sed '$d' | jq -c '.')"
else
    print_fail "Get user stats failed (Status: $HTTP_CODE)"
fi

# ============================================
# 3. GIGS ENDPOINTS
# ============================================

print_test "12" "GET /api/gigs/search - Normal search"
GIGS_SEARCH=$(curl -s -w "\n%{http_code}" "$BASE_URL/gigs/search")
HTTP_CODE=$(echo "$GIGS_SEARCH" | tail -n1)
BODY=$(echo "$GIGS_SEARCH" | sed '$d')
GIG_COUNT=$(echo "$BODY" | jq '. | length')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Gigs search successful - Found $GIG_COUNT gigs (Status: $HTTP_CODE)"
else
    print_fail "Gigs search failed (Status: $HTTP_CODE)"
fi

print_test "13" "GET /api/gigs/search - SQL Injection in query"
SQL_GIGS=$(curl -s -w "\n%{http_code}" "$BASE_URL/gigs/search?query=' UNION SELECT id,title,description,category,price,delivery_days,freelancer_id,created_date,NULL,NULL FROM gigs--")
HTTP_CODE=$(echo "$SQL_GIGS" | tail -n1)
BODY=$(echo "$SQL_GIGS" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_vuln "SQL Injection in gig search - UNION query executed!"
    echo "Result count: $(echo $BODY | jq '. | length')"
else
    print_pass "SQL Injection blocked (Status: $HTTP_CODE)"
fi

print_test "14" "GET /api/gigs/search - SQL Injection in category"
SQL_CAT=$(curl -s -w "\n%{http_code}" "$BASE_URL/gigs/search?category=web' OR '1'='1")
HTTP_CODE=$(echo "$SQL_CAT" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_vuln "SQL Injection in category filter vulnerable!"
else
    print_pass "SQL Injection in category blocked"
fi

print_test "15" "GET /api/gigs/search - Price filters"
PRICE_FILTER=$(curl -s -w "\n%{http_code}" "$BASE_URL/gigs/search?min_price=100&max_price=500")
HTTP_CODE=$(echo "$PRICE_FILTER" | tail -n1)
BODY=$(echo "$PRICE_FILTER" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Price filter works - Found $(echo $BODY | jq '. | length') gigs"
else
    print_fail "Price filter failed (Status: $HTTP_CODE)"
fi

print_test "16" "GET /api/gigs/:id"
GIG_DETAIL=$(curl -s -w "\n%{http_code}" "$BASE_URL/gigs/1")
HTTP_CODE=$(echo "$GIG_DETAIL" | tail -n1)
BODY=$(echo "$GIG_DETAIL" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get gig detail successful (Status: $HTTP_CODE)"
    if echo "$BODY" | grep -q "<script>"; then
        print_vuln "XSS payload found in gig description!"
    fi
else
    print_fail "Get gig detail failed (Status: $HTTP_CODE)"
fi

print_test "17" "POST /api/gigs - Create gig"
CREATE_GIG=$(curl -s -w "\n%{http_code}" -X POST -b $COOKIE_FILE "$BASE_URL/gigs" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Gig Creation",
    "description": "Testing gig creation endpoint",
    "category": "web",
    "price": 299,
    "delivery_days": 7,
    "skills": ["testing", "api"]
  }')
HTTP_CODE=$(echo "$CREATE_GIG" | tail -n1)
BODY=$(echo "$CREATE_GIG" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    print_pass "Gig created successfully (Status: $HTTP_CODE)"
    NEW_GIG_ID=$(echo "$BODY" | jq -r '.id')
    echo "New gig ID: $NEW_GIG_ID"
else
    print_fail "Gig creation failed (Status: $HTTP_CODE)"
    echo "Response: $BODY"
fi

print_test "18" "PUT /api/gigs/:id - Update gig"
if [ ! -z "$NEW_GIG_ID" ]; then
    UPDATE_GIG=$(curl -s -w "\n%{http_code}" -X PUT -b $COOKIE_FILE "$BASE_URL/gigs/$NEW_GIG_ID" \
      -H "Content-Type: application/json" \
      -d '{"price": 350, "delivery_days": 10}')
    HTTP_CODE=$(echo "$UPDATE_GIG" | tail -n1)
    if [ "$HTTP_CODE" = "200" ]; then
        print_pass "Gig updated successfully (Status: $HTTP_CODE)"
    else
        print_fail "Gig update failed (Status: $HTTP_CODE)"
    fi
else
    echo "Skipping - no gig ID available"
fi

print_test "19" "DELETE /api/gigs/:id - Delete gig"
if [ ! -z "$NEW_GIG_ID" ]; then
    DELETE_GIG=$(curl -s -w "\n%{http_code}" -X DELETE -b $COOKIE_FILE "$BASE_URL/gigs/$NEW_GIG_ID")
    HTTP_CODE=$(echo "$DELETE_GIG" | tail -n1)
    if [ "$HTTP_CODE" = "200" ]; then
        print_pass "Gig deleted successfully (Status: $HTTP_CODE)"
    else
        print_fail "Gig deletion failed (Status: $HTTP_CODE)"
    fi
else
    echo "Skipping - no gig ID available"
fi

# ============================================
# 4. PROJECTS ENDPOINTS
# ============================================

print_test "20" "GET /api/projects/search - Normal search"
PROJECTS=$(curl -s -w "\n%{http_code}" "$BASE_URL/projects/search")
HTTP_CODE=$(echo "$PROJECTS" | tail -n1)
BODY=$(echo "$PROJECTS" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Projects search successful - Found $(echo $BODY | jq '. | length') projects"
else
    print_fail "Projects search failed (Status: $HTTP_CODE)"
fi

print_test "21" "GET /api/projects/search - SQL Injection"
SQL_PROJ=$(curl -s -w "\n%{http_code}" "$BASE_URL/projects/search?query=' OR '1'='1")
HTTP_CODE=$(echo "$SQL_PROJ" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_vuln "SQL Injection in project search vulnerable!"
else
    print_pass "SQL Injection blocked"
fi

print_test "22" "GET /api/projects/:id"
PROJECT_DETAIL=$(curl -s -w "\n%{http_code}" "$BASE_URL/projects/1")
HTTP_CODE=$(echo "$PROJECT_DETAIL" | tail -n1)
BODY=$(echo "$PROJECT_DETAIL" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get project detail successful (Status: $HTTP_CODE)"
    if echo "$BODY" | grep -q "onerror"; then
        print_vuln "XSS payload found in project description!"
    fi
else
    print_fail "Get project detail failed (Status: $HTTP_CODE)"
fi

# Login as client for project creation
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_FILE \
  -d '{"email": "alice.startup@example.com", "password": "client123"}' > /dev/null

print_test "23" "POST /api/projects - Create project"
CREATE_PROJ=$(curl -s -w "\n%{http_code}" -X POST -b $COOKIE_FILE "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Testing project creation",
    "budget_min": 1000,
    "budget_max": 2000,
    "duration": "2-4 weeks",
    "skills": ["testing"]
  }')
HTTP_CODE=$(echo "$CREATE_PROJ" | tail -n1)
if [ "$HTTP_CODE" = "201" ]; then
    print_pass "Project created successfully (Status: $HTTP_CODE)"
else
    print_fail "Project creation failed (Status: $HTTP_CODE)"
fi

# ============================================
# 5. PROPOSALS ENDPOINTS
# ============================================

# Login as freelancer
curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_FILE \
  -d '{"email": "john.dev@example.com", "password": "freelancer123"}' > /dev/null

print_test "24" "POST /api/proposals - Create proposal"
CREATE_PROP=$(curl -s -w "\n%{http_code}" -X POST -b $COOKIE_FILE "$BASE_URL/proposals" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "cover_letter": "I would love to work on this project",
    "proposed_amount": 1500,
    "delivery_days": 14
  }')
HTTP_CODE=$(echo "$CREATE_PROP" | tail -n1)
BODY=$(echo "$CREATE_PROP" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    print_pass "Proposal created successfully (Status: $HTTP_CODE)"
    NEW_PROP_ID=$(echo "$BODY" | jq -r '.id')
else
    print_fail "Proposal creation failed (Status: $HTTP_CODE)"
fi

print_test "25" "GET /api/proposals/:id - IDOR vulnerability"
IDOR_PROP=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/proposals/1")
HTTP_CODE=$(echo "$IDOR_PROP" | tail -n1)
BODY=$(echo "$IDOR_PROP" | sed '$d')
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q "id"; then
    print_vuln "IDOR vulnerability - accessed another user's proposal!"
    echo "Accessed proposal: $(echo $BODY | jq -c '{id, project_id, freelancer_id}')"
else
    print_pass "IDOR blocked (Status: $HTTP_CODE)"
fi

print_test "26" "GET /api/proposals/my-proposals"
MY_PROPS=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/proposals/my-proposals")
HTTP_CODE=$(echo "$MY_PROPS" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get my proposals successful (Status: $HTTP_CODE)"
else
    print_fail "Get my proposals failed (Status: $HTTP_CODE)"
fi

# ============================================
# 6. ORDERS ENDPOINTS
# ============================================

print_test "27" "GET /api/orders/purchases"
PURCHASES=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/orders/purchases")
HTTP_CODE=$(echo "$PURCHASES" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get purchases successful (Status: $HTTP_CODE)"
else
    print_fail "Get purchases failed (Status: $HTTP_CODE)"
fi

print_test "28" "GET /api/orders/sales"
SALES=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/orders/sales")
HTTP_CODE=$(echo "$SALES" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get sales successful (Status: $HTTP_CODE)"
else
    print_fail "Get sales failed (Status: $HTTP_CODE)"
fi

print_test "29" "GET /api/orders/:id"
ORDER_DETAIL=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/orders/1")
HTTP_CODE=$(echo "$ORDER_DETAIL" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get order detail successful (Status: $HTTP_CODE)"
else
    print_fail "Get order detail failed (Status: $HTTP_CODE)"
fi

# ============================================
# 7. MESSAGES ENDPOINTS
# ============================================

print_test "30" "POST /api/messages - Send message"
SEND_MSG=$(curl -s -w "\n%{http_code}" -X POST -b $COOKIE_FILE "$BASE_URL/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_id": 3,
    "subject": "Test Message",
    "body": "This is a test message <script>alert(\"XSS\")</script>"
  }')
HTTP_CODE=$(echo "$SEND_MSG" | tail -n1)
BODY=$(echo "$SEND_MSG" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    print_pass "Message sent successfully (Status: $HTTP_CODE)"
    if echo "$BODY" | grep -q "<script>"; then
        print_vuln "XSS payload stored in message body!"
    fi
else
    print_fail "Send message failed (Status: $HTTP_CODE)"
fi

print_test "31" "GET /api/messages/inbox"
INBOX=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/messages/inbox")
HTTP_CODE=$(echo "$INBOX" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get inbox successful (Status: $HTTP_CODE)"
else
    print_fail "Get inbox failed (Status: $HTTP_CODE)"
fi

print_test "32" "GET /api/messages/sent"
SENT=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/messages/sent")
HTTP_CODE=$(echo "$SENT" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get sent messages successful (Status: $HTTP_CODE)"
else
    print_fail "Get sent messages failed (Status: $HTTP_CODE)"
fi

# ============================================
# 8. REVIEWS ENDPOINTS
# ============================================

print_test "33" "GET /api/reviews/user/:userId"
USER_REVIEWS=$(curl -s -w "\n%{http_code}" "$BASE_URL/reviews/user/2")
HTTP_CODE=$(echo "$USER_REVIEWS" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get user reviews successful (Status: $HTTP_CODE)"
else
    print_fail "Get user reviews failed (Status: $HTTP_CODE)"
fi

print_test "34" "GET /api/reviews/:id"
REVIEW=$(curl -s -w "\n%{http_code}" "$BASE_URL/reviews/1")
HTTP_CODE=$(echo "$REVIEW" | tail -n1)
BODY=$(echo "$REVIEW" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get review successful (Status: $HTTP_CODE)"
    if echo "$BODY" | grep -q "<img"; then
        print_vuln "XSS payload found in review comment!"
    fi
else
    print_fail "Get review failed (Status: $HTTP_CODE)"
fi

# ============================================
# 9. FILES ENDPOINTS
# ============================================

print_test "35" "POST /api/files/upload - File upload"
echo "test file content" > /tmp/test_upload.txt
UPLOAD=$(curl -s -w "\n%{http_code}" -X POST -b $COOKIE_FILE "$BASE_URL/files/upload" \
  -F "file=@/tmp/test_upload.txt" \
  -F "entity_type=gig" \
  -F "entity_id=1")
HTTP_CODE=$(echo "$UPLOAD" | tail -n1)
BODY=$(echo "$UPLOAD" | sed '$d')
if [ "$HTTP_CODE" = "201" ]; then
    print_pass "File uploaded successfully (Status: $HTTP_CODE)"
    FILE_ID=$(echo "$BODY" | jq -r '.id')
else
    print_fail "File upload failed (Status: $HTTP_CODE)"
fi

print_test "36" "POST /api/files/upload - Malicious file upload"
echo "<?php system(\$_GET['cmd']); ?>" > /tmp/shell.php
MAL_UPLOAD=$(curl -s -w "\n%{http_code}" -X POST -b $COOKIE_FILE "$BASE_URL/files/upload" \
  -F "file=@/tmp/shell.php" \
  -F "entity_type=gig" \
  -F "entity_id=1")
HTTP_CODE=$(echo "$MAL_UPLOAD" | tail -n1)
if [ "$HTTP_CODE" = "201" ]; then
    print_vuln "Malicious PHP file upload successful - no validation!"
else
    print_pass "Malicious file blocked (Status: $HTTP_CODE)"
fi
rm -f /tmp/shell.php /tmp/test_upload.txt

# ============================================
# 10. TRANSACTIONS ENDPOINTS
# ============================================

print_test "37" "GET /api/transactions/my-transactions"
MY_TRANS=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/transactions/my-transactions")
HTTP_CODE=$(echo "$MY_TRANS" | tail -n1)
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get my transactions successful (Status: $HTTP_CODE)"
else
    print_fail "Get my transactions failed (Status: $HTTP_CODE)"
fi

print_test "38" "GET /api/transactions/balance"
BALANCE=$(curl -s -w "\n%{http_code}" -b $COOKIE_FILE "$BASE_URL/transactions/balance")
HTTP_CODE=$(echo "$BALANCE" | tail -n1)
BODY=$(echo "$BALANCE" | sed '$d')
if [ "$HTTP_CODE" = "200" ]; then
    print_pass "Get balance successful (Status: $HTTP_CODE)"
    echo "Balance: $(echo $BODY | jq -c '.')"
else
    print_fail "Get balance failed (Status: $HTTP_CODE)"
fi

# ============================================
# EDGE CASES & SECURITY TESTS
# ============================================

print_test "39" "Authentication required - Unauthorized access"
UNAUTH=$(curl -s -w "\n%{http_code}" "$BASE_URL/users/me")
HTTP_CODE=$(echo "$UNAUTH" | tail -n1)
if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
    print_pass "Unauthorized access blocked (Status: $HTTP_CODE)"
else
    print_fail "Unauthorized access allowed (Status: $HTTP_CODE)"
fi

print_test "40" "Invalid ID - Non-existent resource"
NOT_FOUND=$(curl -s -w "\n%{http_code}" "$BASE_URL/gigs/99999")
HTTP_CODE=$(echo "$NOT_FOUND" | tail -n1)
if [ "$HTTP_CODE" = "404" ]; then
    print_pass "Non-existent resource returns 404 (Status: $HTTP_CODE)"
else
    print_fail "Non-existent resource did not return 404 (Status: $HTTP_CODE)"
fi

# ============================================
# SUMMARY
# ============================================

echo ""
echo "==========================================="
echo "📊 TEST SUMMARY"
echo "==========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Vulnerabilities Confirmed: $VULNERABLE${NC}"
echo ""
echo "Vulnerability Details:"
echo "  - SQL Injection (Login): Check test #5"
echo "  - SQL Injection (Gigs Search): Check test #13"
echo "  - SQL Injection (Projects Search): Check test #21"
echo "  - IDOR (Proposals): Check test #25"
echo "  - Stored XSS (Messages): Check test #30"
echo "  - File Upload: Check test #36"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All functional tests passed!${NC}"
else
    echo -e "${RED}⚠️  Some tests failed - review output above${NC}"
fi

echo ""
echo "==========================================="
rm -f $COOKIE_FILE

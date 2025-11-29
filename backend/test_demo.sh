#!/bin/bash

echo "========================================="
echo "CITRIQ Backend Demonstration"
echo "========================================="
echo ""

echo "1️⃣  Testing Database Connection..."
curl -s http://localhost:5001/test-db | jq
echo ""

echo "2️⃣  Testing User Registration..."
curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@test.com","password":"demo123","role":"student"}' | jq
echo ""

echo "3️⃣  Testing Login (Getting JWT Token)..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","password":"demo123"}')
echo "$LOGIN_RESPONSE" | jq
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo ""

echo "4️⃣  Testing Protected Route WITHOUT Token (Should Fail)..."
curl -s http://localhost:5001/protected | jq
echo ""

echo "5️⃣  Testing Protected Route WITH Valid Token (Should Succeed)..."
curl -s http://localhost:5001/protected \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

echo "6️⃣  Testing Google Auth Endpoint (Should ask for token)..."
curl -s -X POST http://localhost:5001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{}' | jq
echo ""

echo "========================================="
echo "✅ All Tests Complete!"
echo "========================================="

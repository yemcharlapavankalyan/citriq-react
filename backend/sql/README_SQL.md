# CITRIQ Database Schema

This folder contains the SQL scripts used to create and manage the PostgreSQL database for the CITRIQ platform.

### Files:
- **schema.sql** – Creates all tables (users, review_tasks, submissions, peer_reviews, notifications)
- **sample_data.sql** – Inserts sample admin, student, and one review task
- **drop_all.sql** – Resets the database by dropping all tables

### How to Use (pgAdmin):
1. Create a database named: `citriq_db`
2. Open Query Tool
3. Run `schema.sql`
4. Optionally run `sample_data.sql`
5. Start backend server with correct `.env` settings.

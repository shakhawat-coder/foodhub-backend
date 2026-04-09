SELECT role, COUNT(*) FROM "user" GROUP BY role ORDER BY role;
SELECT status, COUNT(*) FROM "order" GROUP BY status ORDER BY status;
SELECT COUNT(*) AS rider_count FROM "Rider";

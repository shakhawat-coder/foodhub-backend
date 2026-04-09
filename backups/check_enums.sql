SELECT enumtypid::regtype AS enum_name, enumlabel
FROM pg_enum
WHERE enumtypid::regtype::text IN ('"ROLE"','"ORDERSTATUS"')
ORDER BY enum_name, enumsortorder;

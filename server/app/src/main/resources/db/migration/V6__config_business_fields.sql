PRAGMA foreign_keys = OFF;

CREATE TABLE config__new (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    business_type TEXT NOT NULL DEFAULT 'restaurant' CHECK (business_type IN ('store','restaurant')),
    business_name TEXT NOT NULL,
    business_address TEXT,
    business_phone TEXT,
    business_email TEXT,
    business_tax_id TEXT,
    business_logo_url TEXT
);

INSERT INTO config__new (id, business_type, business_name, business_address, business_phone, business_email, business_tax_id, business_logo_url)
SELECT id, 'restaurant', restaurant_name, address, phone, email, tax_id, NULL
FROM config
WHERE id = 1;

DROP TABLE config;
ALTER TABLE config__new RENAME TO config;

PRAGMA foreign_keys = ON;

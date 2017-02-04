--DROP DATABASE IF EXISTS dovetail;
--CREATE DATABASE dovetail;

--\c dovetail;

DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;

--DROP TABLE IF EXISTS users;
--DROP TABLE IF EXISTS companies;


CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  label TEXT not null,
  summary text,
  prompt text,
  success_criteria text,
  record_time int default 30,
  company_name text,
  company_logo_url text,
  active boolean default true,
  hiring_manager text,
  hiring_manager_pic_url text,
  hiring_manager_email text,
  created_at TIMESTAMP NOT NULL default now()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) not null,
  contact_name text,
  email text,
  video_token TEXT,
  created_at TIMESTAMP NOT NULL default now(),
  first_viewed_at TIMESTAMP
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  contact_name text,
  email text,
  rating int,
  follow_up_opt_in BOOLEAN,
  created_at TIMESTAMP NOT NULL default now()
);

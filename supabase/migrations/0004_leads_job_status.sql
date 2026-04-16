-- Track background job status on leads
ALTER TABLE leads ADD COLUMN job_status TEXT CHECK (job_status IN ('enriching', 'generating_demo', 'launching', 'failed'));

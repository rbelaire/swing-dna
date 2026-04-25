# Supabase Setup for Golf Biomechanics Features

## Database Schema

### Golf Intake Forms Table

The application requires a `golf_intake_forms` table to store student intake form submissions.

#### Option 1: Using Supabase Migrations (Recommended)

If using Supabase CLI:

```bash
supabase migration up
```

This will run the migration in `supabase/migrations/add_golf_intake_forms_table.sql`

#### Option 2: Manual Setup in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and run the SQL from `supabase/migrations/add_golf_intake_forms_table.sql`

#### Table Structure

```sql
CREATE TABLE golf_intake_forms (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  measurements JSONB,
  movement_tests JSONB,
  video_count JSONB,
  status TEXT DEFAULT 'pending_review',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Measurements JSON Schema

```json
{
  "height": "72",
  "wingspan": "73",
  "trailArmKnuckleElbow": "9.5",
  "trailArmCollarElbow": "11"
}
```

#### Movement Tests JSON Schema

```json
{
  "trailHandRotation": "Palm Up",
  "hipRotationTowardTarget": "About 45°",
  "hipRotationAwayFromTarget": "Lead side (front foot)"
}
```

#### Video Count JSON Schema

```json
{
  "dtl": 5,
  "faceOn": 5
}
```

## Real-time Subscriptions

The admin panel uses Supabase real-time subscriptions to notify admins of new submissions. This is automatically handled by the `AdminIntakeSubmissions` component.

### Enable Real-time Notifications

In your Supabase project dashboard:

1. Go to **Replication** under your project settings
2. Enable replication on the `golf_intake_forms` table
3. The app will automatically subscribe to INSERT events

## Row-Level Security (RLS)

RLS policies are set up to ensure:

- **Students** can only view their own submissions
- **Admins** can view all submissions
- **Students** can insert their own submissions
- **Admins** can update submission status

These policies are automatically created by the migration SQL.

## Video Storage Setup

Video uploads are now integrated. Follow these steps to enable:

### 1. Create Storage Bucket

In your Supabase project dashboard:

1. Go to **Storage** → **Buckets**
2. Click **New Bucket**
3. Name: `swing-videos`
4. Set visibility to **Private** (RLS controlled)
5. Click **Create Bucket**

### 2. Set Up RLS Policies for Storage

In the SQL Editor, run:

```sql
-- Allow students to upload their own videos
CREATE POLICY "Students can upload videos for their submission"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'swing-videos' AND
    auth.role() = 'authenticated'
  );

-- Allow students to read their own videos
CREATE POLICY "Students can read their own videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'swing-videos' AND
    auth.role() = 'authenticated'
  );

-- Allow admins to read all videos
CREATE POLICY "Admins can read all videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'swing-videos' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
```

### 3. Update Database Schema

Run the migration that includes `video_urls` column:

```bash
supabase migration up
```

Or manually add the column if the migration has already been run:

```sql
ALTER TABLE golf_intake_forms
ADD COLUMN video_urls JSONB DEFAULT '{}'::jsonb,
ADD COLUMN swing_dna_report JSONB;
```

### Video Upload Flow

1. Student fills form and selects video files (both DTL and Face-On)
2. On form submit:
   - Intake data is saved to database (gets submission ID)
   - Videos are uploaded to `swing-videos/[submissionId]/[angle]/`
   - Video URLs are stored in `video_urls` JSONB field
3. Coach can review videos in ReviewIntake component
4. Videos persist in Storage for future reference

### Video URL Structure

```json
{
  "dtl": [
    "submissions/1234/dtl/swing-1-1234567890.mp4",
    "submissions/1234/dtl/swing-2-1234567890.mp4"
  ],
  "faceOn": [
    "submissions/1234/faceOn/swing-1-1234567890.mp4",
    "submissions/1234/faceOn/swing-2-1234567890.mp4"
  ]
}
```

## Status Values

The `status` field can have the following values:

- `pending_review` - Form submitted, awaiting review
- `under_analysis` - Coach is analyzing the submission
- `completed` - Analysis complete, report generated

Admins can update this status in the admin panel.

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

## Future Enhancements

### Video Storage

Currently, the form collects video file references but doesn't upload them. To add video uploads:

1. Create a Supabase Storage bucket called `swing-videos`
2. Update `GolfBiomechanicsIntakeForm.jsx` to upload files to storage
3. Store the file paths in the `measurements` JSONB field

### Example Video Upload Code

```javascript
async function uploadVideo(file, submissionId, angle) {
  const { data, error } = await supabase.storage
    .from('swing-videos')
    .upload(`${submissionId}/${angle}/${file.name}`, file)
  
  if (error) throw error
  return data.path
}
```

## Status Values

The `status` field can have the following values:

- `pending_review` - Form submitted, awaiting review
- `under_analysis` - Coach is analyzing the submission
- `completed` - Analysis complete, report generated

Admins can update this status in the admin panel.

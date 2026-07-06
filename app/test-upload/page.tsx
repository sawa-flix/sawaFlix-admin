import React from 'react';

export default function TestUploadPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Music</h1>
      <form
        method="post"
        encType="multipart/form-data"
        action="/api/content/music/upload"
      >
        <div>
          <label>Audio file: <input type="file" name="audio" required /></label>
        </div>
        <div>
          <label>Cover image: <input type="file" name="cover" /></label>
        </div>
        <div>
          <label>Title: <input type="text" name="title" required /></label>
        </div>
        <div>
          <label>Description: <textarea name="description" /></label>
        </div>
        <div>
          <label>Featured? <select name="is_featured"><option value="false">No</option><option value="true">Yes</option></select></label>
        </div>
        <div>
          <label>Genre (comma-separated): <input type="text" name="genre" /></label>
        </div>
        <div>
          <label>Tags (comma-separated): <input type="text" name="tags" /></label>
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

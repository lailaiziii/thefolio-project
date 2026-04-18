import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import '../App.css';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setIsSubmitting(true);
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    
    // CRITICAL: Ensure 'image' matches your backend upload.single('image')
    if (image) {
      fd.append('image', image);
    }
    
    try {
      // Note: Do not set headers manually; Axios handles FormData headers automatically
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to publish post. Check your connection.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='create-post-wrapper'>
      <div className="container">
        <header className="page-header">
          <h2>Create New Post</h2>
          <p className="subtitle">Share your latest digital illustration or thoughts with the gallery.</p>
        </header>

        <div className="form-card-balanced">
          {error && <div className="error-banner">{error}</div>}
          
          <form onSubmit={handleSubmit} className="balanced-form">
            <div className="form-grid">
              <div className="form-main">
                <div className="form-group">
                  <label htmlFor="title">Post Title</label>
                  <input 
                    id="title"
                    className="custom-input"
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder='Give your art a name...' 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="body">Story / Description</label>
                  <textarea 
                    id="body"
                    className="custom-textarea"
                    value={body} 
                    onChange={e => setBody(e.target.value)} 
                    placeholder='Tell the story behind this piece...' 
                    rows={10} 
                    required 
                  />
                </div>
              </div>
            <div className="form-aside">
              <div className="form-group upload-section">
                <label className="file-label">Cover Artwork</label>
                <input 
                  type='file' 
                  className="file-input-custom"
                  accept='image/*' 
                  onChange={handleFileChange} 
                />
                <small className="file-hint">Supported formats: JPG, PNG, WebP</small>
              </div>

              {previewUrl && (
                <div className="preview-card">
                  <img src={previewUrl} alt="Selected artwork preview" className="preview-image" />
                  <p className="preview-caption">Preview of the selected artwork.</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions-centered">
            <button 
              type='submit' 
              className="theme-btn large-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish to Gallery'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { getUploadsBaseUrl } from '../api/axios';
import '../App.css';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/posts/${id}`);
        const postData = res.data;
        
        const isOwner = user && user._id === postData.author?._id;
        const isAdmin = user && user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          setError('You are not authorized to edit this post.');
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setBody(postData.body);
        setCurrentImage(postData.image || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) {
      fd.append('image', image);
    }

    try {
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="status-container"><div className="loader">Loading Editor...</div></div>;

  if (error && !post) {
    return (
      <div className="status-container">
        <p>{error}</p>
        <Link to="/home" className="theme-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="create-post-wrapper">
      <div className="container">
        <header className="page-header">
          <h2>Edit Masterpiece</h2>
          <p className="subtitle">Refine your digital story and artwork.</p>
        </header>

        <div className="form-card-balanced">
          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleUpdate} className="balanced-form">
            <div className="form-grid">
              <div className="form-main">
                <div className="form-group">
                  <label htmlFor="title">Post Title</label>
                  <input
                    id="title"
                    className="custom-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Update your artwork title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="body">Story / Description</label>
                  <textarea
                    id="body"
                    className="custom-textarea"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Refine the story behind this piece..."
                    rows={10}
                    required
                  />
                </div>
              </div>

              <div className="form-aside">
                <div className="form-group upload-section">
                  <label className="file-label">Replace Cover Image (Optional)</label>
                  <input
                    type="file"
                    className="file-input-custom"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="file-hint">Leave empty to keep current image. Supported: JPG, PNG, WebP</small>
                </div>

                <div className="preview-card">
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="New artwork preview" className="preview-image" />
                      <p className="preview-caption">New image preview.</p>
                    </>
                  ) : currentImage ? (
                    <>
                      <img src={`${getUploadsBaseUrl()}/uploads/${currentImage}`} alt="Current artwork" className="preview-image" />
                      <p className="preview-caption">Current image.</p>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#8b92ad' }}>
                      No image
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions-centered">
              <button type="button" onClick={() => navigate(-1)} className="theme-btn" style={{ background: '#8b92ad' }}>
                Cancel
              </button>
              <button type="submit" className="theme-btn large-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;

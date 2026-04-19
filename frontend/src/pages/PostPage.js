import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { getUploadsBaseUrl } from '../api/axios';
import '../App.css';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [postError, setPostError] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const canManagePost = user && post && (user._id === post.author?._id || user.role === 'admin');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
        setPostError('');
      } catch (err) {
        setPostError(err.response?.data?.message || 'Art piece not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await API.get(`/comments/${id}`);
        setComments(res.data);
        setCommentsError('');
      } catch (err) {
        setCommentsError(err.response?.data?.message || 'Comments could not be loaded.');
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this masterpiece?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete the post.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');

    if (!commentBody.trim()) {
      setCommentError('Comment cannot be blank.');
      return;
    }

    setIsCommentSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody.trim() });
      setComments((prev) => [...prev, data]);
      setCommentBody('');
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Unable to add comment right now.');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  if (loading) return <div className="status-container"><div className="loader">Opening Gallery...</div></div>;
  if (postError || !post) return <div className="status-container"><p>{postError}</p><Link to="/home" className="theme-btn">Back to Home</Link></div>;

  return (
    <div className="post-view-wrapper">
      <div className="container">
        <div className="post-navigation">
          <Link to="/home" className="back-link">← Back to Gallery</Link>

          {canManagePost && (
            <div className="author-controls">
              <Link to={`/edit-post/${post._id}`} className="edit-btn-mini">Edit ✏️</Link>
              <button onClick={handleDeletePost} className="delete-btn-mini">Delete 🗑️</button>
            </div>
          )}
        </div>

        <article className="post-card-detailed">
          {post.image && (
            <div className="post-image-frame">
              <img src={`${getUploadsBaseUrl()}/uploads/${post.image}`} alt={post.title} className="full-post-img" />
            </div>
          )}

          <div className="post-text-content">
            <header className="post-header-balanced">
              <h1 className="post-display-title">{post.title}</h1>
              <div className="post-info-bar">
                <span className="author-name">By {post.author?.name || 'Unknown Artist'}</span>
                <span className="separator">•</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </header>

            <div className="post-body-text">
              {post.body.split('\n').map((para, i) => (
                para.trim() ? <p key={i}>{para}</p> : <div key={i} className="spacer" />
              ))}
            </div>

            <section className="comments-section">
              <div className="comments-header">
                <div>
                  <h2>Comments</h2>
                  <p className="comments-count">{comments.length} comment{comments.length === 1 ? '' : 's'}</p>
                </div>
              </div>

              {user ? (
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Write your comment here..."
                    rows={4}
                    className="custom-textarea"
                  />
                  {commentError && <p className="error-banner comment-error">{commentError}</p>}
                  {commentsError && <p className="error-banner comment-error">{commentsError}</p>}
                  <div className="comment-actions">
                    <button type="submit" className="theme-btn comment-submit-btn" disabled={isCommentSubmitting}>
                      {isCommentSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="comment-cta">
                  <p>You must be logged in to leave a comment.</p>
                  <Link to="/login" className="theme-btn">Login to Comment</Link>
                </div>
              )}

              {commentsError && !user && <p className="error-banner comment-error">{commentsError}</p>}

              <div className="comment-list">
                {commentsLoading ? (
                  <div className="status-container"><div className="loader">Loading comments...</div></div>
                ) : commentsError ? (
                  <div className="error-banner comment-error">{commentsError}</div>
                ) : comments.length === 0 ? (
                  <div className="comment-empty">No comments yet. Be the first to respond.</div>
                ) : (
                  comments.map((comment) => {
                    const canDeleteComment = user && (comment.author?._id === user._id || user.role === 'admin');
                    return (
                      <div key={comment._id} className="comment-card">
                        <div className="comment-author-row">
                          <div className="comment-author-badge">
                            {comment.author?.name?.[0] || 'A'}
                          </div>
                          <div>
                            <p className="comment-author-name">{comment.author?.name || 'Anonymous'}</p>
                            <p className="comment-timestamp">{new Date(comment.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="comment-body">{comment.body}</p>
                        {canDeleteComment && (
                          <button onClick={() => handleDeleteComment(comment._id)} className="comment-delete-btn">
                            Delete
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostPage;

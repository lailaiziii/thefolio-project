import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { getUploadsBaseUrl } from '../api/axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const uploadsBaseUrl = getUploadsBaseUrl();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div id="siteContent">
      <section className="digital">
        <img src="/assets/digital_art.png" alt="Digital illustration artwork" />
        <div>
          <h1>Digital Illustration & Visual Storytelling</h1>
          <h3><i>"Exploring creativity through digital art, emotion, and imagination"</i></h3>
          <p>Creating art is a journey of self-expression and storytelling. Through my illustrations, I hope to inspire curiosity, creativity, and personal interpretation from anyone who sees them.</p>
        </div>
      </section>

      <section className="focus-cards">
        <div className="focus-card">
          <h4>Visual Storytelling</h4>
          <p>Each artwork tells a story through emotion, color, and composition.</p>
        </div>
        <div className="focus-card">
          <h4>Creative Process</h4>
          <p>From concept sketches to refined digital illustrations.</p>
        </div>
        <div className="focus-card">
          <h4>Art Style</h4>
          <p>A balance of imagination, mood, and expressive visuals.</p>
        </div>
      </section>

      <section className="content">
        <h3>Why Digital Illustration?</h3>
        <ul>
          <li>Transforms ideas into visual stories</li>
          <li>Blends technology and creativity</li>
          <li>Encourages self-expression</li>
          <li>Builds strong visual communication skills</li>
        </ul>
      </section>

      <section className="posts-feed">
        <h2>Community Posts</h2>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="posts-list">
            {posts.map(post => (
              <article key={post._id} className="post-card">
                <h3>{post.title}</h3>
                {post.image && (
                  <img 
                    src={`${uploadsBaseUrl}/uploads/${post.image}`} 
                    alt={post.title}
                    className="post-image"
                    onError={(e) => { e.target.src = '/assets/placeholder.png'; }} // Fallback if image fails
                  />
                )}
                <p className="post-body">{post.body.substring(0, 200)}...</p>
                <p className="post-meta">
                  By <strong>{post.author?.name || 'Anonymous'}</strong> • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link to={`/posts/${post._id}`} className="read-more-btn">
                  Read More & Comment
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p>No posts yet. <Link to="/create-post">Create the first one!</Link></p>
        )}
      </section>

      <section className="featured-art">
        <h2 align="center">Featured Works</h2>
        <div className="art-grid">
          <div className="art-card">
            <img src="/assets/music_art.jpg" alt="Featured artwork" />
            <p><em>“A piece inspired by imagination and emotional expression.”</em></p>
          </div>
          <div className="art-card">
            <img src="/assets/portrait_art.jpg" alt="Digital concept" />
            <p><em>“Exploring color, mood, and storytelling through visuals.”</em></p>
          </div>
          <div className="art-card">
            <img src="/assets/scenery_art.png" alt="Illustration detail" />
            <p><em>“A moment captured through digital creativity.”</em></p>
          </div>
        </div>
      </section>

      <section className="creative-process-custom">
        <div className="creative-container">
          <h2>My Creative Process</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Concept & Inspiration</h3>
              <p>Ideas begin with emotions, music, or everyday experiences.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Sketching & Planning</h3>
              <p>Rough sketches help shape composition and flow.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Digital Rendering</h3>
              <p>Colors, lighting, and details are refined using digital tools.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Final Refinement</h3>
              <p>Adjustments are made to enhance mood and storytelling.</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>Email: elaizapraisemiana@gmail.com | Phone: 09464912676</p>
        <p>© 2026 Illustrated Mind | Images from Unsplash & Pexels</p>
      </footer>
    </div>
  );
};

export default HomePage;

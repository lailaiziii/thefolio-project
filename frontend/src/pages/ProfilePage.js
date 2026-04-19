import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API, { getUploadsBaseUrl } from '../api/axios';
import '../App.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Sync local state with user data when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setImageLoading(true);
      setImageError(false);
    }
  }, [user]);

  const handleProfile = async (e) => {
    e.preventDefault(); 
    setMsg('');
    setIsSubmittingProfile(true);
    
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    
    console.log('Sending profile update:', {
      name,
      bio,
      hasPic: !!pic,
      picName: pic?.name
    });
    
    try {
      const { data } = await API.put('/auth/profile', fd);
      console.log('Profile update response:', data);
      console.log('Profile picture in response:', data.profilePic);
      setUser(data);
      setMsg('Profile updated successfully!');
      setPic(null); // Clear the file input
    } catch (err) { 
      console.error('Profile update error:', err);
      setMsg(err.response?.data?.message || 'Error updating profile'); 
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); 
    setMsg('');
    setIsSubmittingPassword(true);
    
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setMsg('Password changed successfully!');
      setCurPw(''); 
      setNewPw('');
    } catch (err) { 
      console.error('Password change error:', err);
      setMsg(err.response?.data?.message || 'Error changing password'); 
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const picSrc = user?.profilePic
    ? `${getUploadsBaseUrl()}/uploads/${user.profilePic}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=140&background=0066ff&color=ffffff`;

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoading(false);
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=140&background=0066ff&color=ffffff`;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <div className='profile-wrapper-custom'>
      <div className="container">
        <header className="page-header">
          <h2>My Profile</h2>
          <p className="subtitle">Manage your profile, upload a photo, and secure your account.</p>
        </header>

        {!user && (
          <div className="status-banner" style={{background: 'rgba(255, 152, 0, 0.1)', borderColor: '#ff9800'}}>
            <p style={{color: '#e65100'}}>Please log in to view and edit your profile.</p>
          </div>
        )}

        <div className="profile-grid">
          <aside className="profile-card-sidebar">
            <div className="avatar-frame">
              <img 
                src={picSrc} 
                alt='Profile' 
                className='profile-pic-preview'
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{opacity: imageLoading && user?.profilePic ? 0.7 : 1}}
              />
              {imageError && (
                <div className="avatar-error">Could not load image</div>
              )}
            </div>
            <div className="sidebar-info">
              <h3>{name || user?.name || 'User'}</h3>
              <p className="user-role-tag">{user?.role || 'Member'}</p>
              <p className="sidebar-bio">{bio || user?.bio || 'No bio yet...'}</p>
            </div>
            <div className="profile-card-footer">
              <p className='profile-card-label'>Current email</p>
              <p className='profile-card-value'>{user?.email || 'Not available'}</p>
            </div>
          </aside>

          <div className="profile-forms-column">
            <form onSubmit={handleProfile} className="form-card-balanced profile-form-card">
              <h3>Update Profile</h3>
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  className="custom-input"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder='Display name' 
                />
              </div>
              <div className="form-group">
                <label>Short Bio</label>
                <textarea 
                  className="custom-textarea"
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder='Tell the community about your art...' 
                  rows={4} 
                />
              </div>
              <div className="form-group">
                <label>Update Profile Picture</label>
                <input 
                  type='file' 
                  className="file-input-custom"
                  accept='image/*' 
                  onChange={e => setPic(e.target.files[0])} 
                />
                {pic && <p className='file-hint'>Selected file: {pic.name}</p>}
              </div>
              <button type='submit' className="theme-btn" disabled={isSubmittingProfile}>
                {isSubmittingProfile ? 'Updating...' : 'Save Profile Changes'}
              </button>
            </form>

            <form onSubmit={handlePassword} className="form-card-balanced profile-form-card">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type='password' 
                  className="custom-input"
                  placeholder='Current password' 
                  value={curPw} 
                  onChange={e => setCurPw(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type='password' 
                  className="custom-input"
                  placeholder='New password (min 6 chars)' 
                  value={newPw} 
                  onChange={e => setNewPw(e.target.value)} 
                  required 
                  minLength={6} 
                />
              </div>
              <button type='submit' className="btn-secondary-outline" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? 'Updating...' : 'Update Security'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage'; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // --- IMAGE UPLOAD STATE ---
  const [imageSrc, setImageSrc] = useState(null); 
  const [crop, setCrop] = useState({ x: 0, y: 0 }); 
  const [zoom, setZoom] = useState(1); 
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); 
  const [isCropping, setIsCropping] = useState(false); 
  
  const fileInputRef = useRef(null); 

  // 1. Fetch User
  const getUser = async () => {
    const token = localStorage.getItem('token');
    if(!token) return;
    try {
      const response = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        headers: { "auth-token": token }
      });
      const json = await response.json();
      setUser(json);
      setFormData({ name: json.name });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => { getUser(); }, []);

  // 2. Trigger File Picker
  const triggerFileSelect = () => fileInputRef.current.click();

  // 3. Handle File Selection
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result); 
        setIsCropping(true); 
      });
      reader.readAsDataURL(file);
    }
  };

  // 4. Save Cropped Image & Upload
  const showCroppedImage = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/auth/updateuser", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "auth-token": token 
        },
        body: JSON.stringify({ avatar: croppedImageBase64 }) 
      });

      const json = await response.json();
      setUser(json); 
      setIsCropping(false); 
      setImageSrc(null);
      toast.success("Profile Photo Updated");

      // -----------------------------------------------------
      // 👇 THIS WAS MISSING OR NOT WORKING FOR THE IMAGE 👇
      // This command tells the Navbar to re-fetch the data immediately
      window.dispatchEvent(new Event("userUpdated")); 
      // -----------------------------------------------------

    } catch (e) {
      console.error(e);
      toast.error("Failed to update image");
    }
  };

  // 5. Handle Text Update
  const handleTextUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const response = await fetch("http://localhost:5000/api/auth/updateuser", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "auth-token": token },
            body: JSON.stringify({ name: formData.name })
        });
        const json = await response.json();
        setUser(json);
        setIsEditing(false);
        toast.success("Name Updated");
       window.dispatchEvent(new Event("userUpdated")); 
    } catch (error) {
        toast.error("Update Failed");
    }
  };

  if (loading) return <div style={{color:'white', padding: '100px', textAlign:'center'}}>Loading Profile...</div>;

  return (
    <div style={{ padding: '120px 20px', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      
      {/* --- CROP MODAL --- */}
      {isCropping && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.85)', zIndex: 2000,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ position: 'relative', width: '90%', maxWidth: '500px', height: '400px', background: '#333', borderRadius: '20px', overflow: 'hidden' }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"    // <--- THIS MAKES IT CIRCULAR
                    showGrid={false}     // <--- HIDES THE GRID FOR CLEANER LOOK
                    onCropChange={setCrop}
                    onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                    onZoomChange={setZoom}
                />
            </div>
            
            {/* Zoom Slider */}
            <div style={{ marginTop: '20px', width: '300px' }}>
                <label style={{display: 'block', marginBottom: '10px', textAlign: 'center'}}>Zoom</label>
                <input 
                    type="range" value={zoom} min={1} max={3} step={0.1}
                    onChange={(e) => setZoom(e.target.value)}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                {/* CANCEL BUTTON: White Text & Red Border */}
                <button 
                    onClick={() => setIsCropping(false)} 
                    style={{
                        padding: '10px 30px', borderRadius: '50px', 
                        background: 'transparent', 
                        border: '1px solid #ff4757', color: '#ff4757', // High Contrast Red
                        cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    Cancel
                </button>
                
                <button onClick={showCroppedImage} style={btnStyle}>Set Profile Picture</button>
            </div>
        </div>
      )}

      {/* --- MAIN CARD --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: '600px', padding: '40px', borderRadius: '20px', position: 'relative' }}
      >
        <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="btn-neon"
            style={{ position: 'absolute', top: '20px', right: '20px', padding: '5px 15px', fontSize: '12px' }}
        >
            {isEditing ? "Cancel" : "Edit Name"}
        </button>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            
            {/* AVATAR + EDIT ICON */}
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px auto' }}>
                
                {/* The Image */}
                <div style={{ 
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: user.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #00d2d3, #2e86de)', 
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    border: '3px solid #00d2d3',
                    boxShadow: '0 0 30px rgba(0,210,211,0.4)'
                }}>
                     {!user.avatar && <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', fontWeight:'bold' }}>{user.name.charAt(0)}</div>}
                </div>

                {/* The Edit Icon (Camera) */}
                <button 
                    onClick={triggerFileSelect}
                    style={{
                        position: 'absolute', bottom: '0', right: '0',
                        background: '#0f172a', border: '2px solid #00d2d3',
                        color: '#00d2d3', borderRadius: '50%',
                        width: '35px', height: '35px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Change Profile Photo"
                >
                    📷
                </button>

                {/* Hidden File Input */}
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={onFileChange} 
                    style={{ display: 'none' }} 
                />
            </div>
            
            {!isEditing ? (
                <>
                    <h1 style={{ margin: 0 }}>{user.name}</h1>
                    <p style={{ color: '#94a3b8' }}>{user.role} • Level 1</p>
                </>
            ) : (
                <form onSubmit={handleTextUpdate} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                    <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={inputStyle}
                    />
                    <button type="submit" className="btn-neon" style={{padding: '8px 15px'}}>Save</button>
                </form>
            )}
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: 'grid', gap: '20px' }}>
            <div style={fieldStyle}>
                <label style={labelStyle}>Email Address</label>
                <div style={valueStyle}>{user.email}</div>
            </div>
            <div style={fieldStyle}>
                <label style={labelStyle}>Member Since</label>
                <div style={valueStyle}>{new Date(user.date).toLocaleDateString()}</div>
            </div>
            <div style={fieldStyle}>
                <label style={labelStyle}>Researcher ID</label>
                <div style={{...valueStyle, fontFamily: 'monospace', color: '#00d2d3'}}>
                    #{user._id.substring(0, 8).toUpperCase()}
                </div>
            </div>
        </div>

      </motion.div>
    </div>
  );
};

// Styles
const fieldStyle = { background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px' };
const labelStyle = { display: 'block', color: '#64748b', fontSize: '12px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' };
const valueStyle = { color: 'white', fontSize: '16px' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #333', background: '#0f172a', color: 'white' };
const btnStyle = { padding: '10px 20px', borderRadius: '50px', background: '#00d2d3', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' };

export default Profile;
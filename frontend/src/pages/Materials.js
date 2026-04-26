import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form,      setForm]      = useState({ title:'', description:'', subject:'', tags:'' });
  const [file,      setFile]      = useState(null);
  const [search,    setSearch]    = useState('');
  const [uploading, setUploading] = useState(false);
  const [msg,       setMsg]       = useState('');

  const fetchMaterials = async () => {
    const { data } = await API.get('/materials', { params: { search } });
    setMaterials(data);
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault(); setUploading(true); setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('file', file);
      await API.post('/materials', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg(' Uploaded successfully!');
      setForm({ title:'', description:'', subject:'', tags:'' }); setFile(null);
      fetchMaterials();
    } catch (err) {
      setMsg((err.response?.data?.message || 'Upload failed'));
    } finally { setUploading(false); }
  };

  return (
    <div>
      <h2> Study Materials</h2>
      {/* Upload Form */}
      <div style={{ background:'#f8f9ff', border:'1px solid #e0e7ff', padding:'24px', borderRadius:'10px', marginBottom:'30px' }}>
        <h3 style={{ margin:'0 0 16px' }}>Upload a Material</h3>
        {msg && <p style={{ marginBottom:'12px', fontWeight:'600' }}>{msg}</p>}
        <form onSubmit={handleUpload}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <input placeholder="Title *" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} style={inp} required />
            <input placeholder="Subject (e.g. Math)" value={form.subject}
              onChange={e => setForm({...form, subject: e.target.value})} style={inp} />
          </div>
          <input placeholder="Tags (comma separated)" value={form.tags}
            onChange={e => setForm({...form, tags: e.target.value})} style={inp} />
          <textarea placeholder="Description" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            style={{ ...inp, height:'80px', resize:'vertical' }} />
          <div style={{ display:'flex', gap:'12px', alignItems:'center', flexWrap:'wrap' }}>
            <input type="file" onChange={e => setFile(e.target.files[0])} required
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" />
            <button type="submit" style={btn} disabled={uploading}>
              {uploading ? 'Uploading...' : '⬆ Upload'}
            </button>
          </div>
        </form>
      </div>
      {/* Search */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
        <input placeholder="🔍 Search materials..." value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchMaterials()}
          style={{ flex:1, padding:'10px 14px', border:'1px solid #ccc', borderRadius:'5px' }} />
        <button onClick={fetchMaterials} style={btn}>Search</button>
      </div>
      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))', gap:'16px' }}>
        {materials.map(m => (
          <div key={m._id} style={card}>
            <div style={{ fontSize:'28px', marginBottom:'8px' }}>
              {m.fileType?.includes('pdf') ? '📄' : m.fileType?.includes('image') ? '🖼️' : '📎'}
            </div>
            <h4 style={{ margin:'0 0 6px', color:'#1a1a2e' }}>{m.title}</h4>
            {m.subject && <span style={tagBadge}>{m.subject}</span>}
            <p style={{ color:'#666', fontSize:'13px', margin:'8px 0' }}>{m.description}</p>
            <a href={`http://localhost:5000${m.fileUrl}`} target="_blank" rel="noreferrer"
              style={{ color:'#e94560', fontWeight:'600', textDecoration:'none' }}>⬇ Download</a>
            <br />
            <small style={{ color:'#aaa' }}>by {m.uploader?.name}</small>
          </div>
        ))}
        {materials.length === 0 && <p style={{ color:'#888' }}>No materials yet. Upload one above!</p>}
      </div>
    </div>
  );
}

const inp      = { display:'block', width:'100%', marginBottom:'12px', padding:'10px', border:'1px solid #ccc', borderRadius:'5px', boxSizing:'border-box', fontSize:'15px' };
const btn      = { padding:'10px 20px', background:'#e94560', color:'#fff', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'600' };
const card     = { border:'1px solid #e8e8e8', borderRadius:'10px', padding:'18px', background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' };
const tagBadge = { background:'#eef2ff', color:'#4a6fa5', padding:'3px 10px', borderRadius:'20px', fontSize:'12px' };
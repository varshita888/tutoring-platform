import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function AskQuestion() {
  const [form,  setForm]  = useState({ title:'', body:'', tags:'' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
      const { data } = await API.post('/questions', payload);
      navigate(`/questions/${data._id}`);
    } catch (err) { setError(err.response?.data?.message || 'Failed to post'); }
  };

  return (
    <div style={{ maxWidth:'740px', margin:'0 auto' }}>
      <h2> Ask a Question</h2>
      <p style={{ color:'#666' }}>Be specific. Give as much context as possible.</p>
      {error && <p style={{ color:'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label style={lbl}>Title</label>
        <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
          style={inp} placeholder="e.g. How do I reverse a string in Python?" required />
        <label style={lbl}>Body — describe your problem in detail</label>
        <textarea value={form.body} onChange={e => setForm({...form, body: e.target.value})}
          style={{ ...inp, height:'200px', resize:'vertical' }}
          placeholder="Include what you've tried..." required />
        <label style={lbl}>Tags (comma separated)</label>
        <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
          style={inp} placeholder="e.g. python, strings, algorithms" />
        <button type="submit" style={btn}>Post Question</button>
      </form>
    </div>
  );
}

const lbl = { display:'block', fontWeight:'600', marginBottom:'6px', color:'#333' };
const inp  = { display:'block', width:'100%', marginBottom:'18px', padding:'11px', border:'1px solid #ccc', borderRadius:'5px', boxSizing:'border-box', fontSize:'15px', fontFamily:'inherit' };
const btn  = { padding:'11px 28px', background:'#e94560', color:'#fff', border:'none', borderRadius:'5px', cursor:'pointer', fontSize:'16px', fontWeight:'600' };
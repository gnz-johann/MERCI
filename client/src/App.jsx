function App() {
  return (
    <div style={{ 
      backgroundColor: '#1e293b', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0' }}>MERCI</h1>
      <p style={{ color: '#94a3b8' }}>Prueba de renderizado local exitosa.</p>
      <div style={{ marginTop: '20px', padding: '10px 20px', background: '#10b981', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
        SISTEMA OPERATIVO
      </div>
    </div>
  )
}

export default App
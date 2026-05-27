import { useState } from 'react';

const MiniPostman = ({ response }) => {
    const [desplegado, setDesplegado] = useState(false);

    if (!response) return null;

    return (
        <div style={{ marginTop: '30px', border: '1px solid #333', borderRadius: '6px', overflow: 'hidden' }}>
            <button 
                onClick={() => setDesplegado(!desplegado)}
                style={{
                    width: '100%', padding: '12px', backgroundColor: '#1e1e1e', color: '#61afef',
                    border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold',
                    fontSize: '13px', display: 'flex', justifyContent: 'space-between'
                }}
            >
                <span>💻 Mini-Postman Inteligente {desplegado ? '(Click para ocultar)' : '(Click para ver respuesta cruda API)'}</span>
                <span>{desplegado ? '▼' : '▲'}</span>
            </button>

            {desplegado && (
                <pre style={{
                    margin: 0, padding: '15px', backgroundColor: '#151515', color: '#98c379',
                    fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto', maxHeight: '300px'
                }}>
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default MiniPostman;
import React, { ChangeEvent, useState } from 'react';

interface Props{
    handleModalDelete: () => void;
    handleDelete: (e:string) => void;
    error: string;
}

const ModalDelete:React.FC<Props> = ({ handleModalDelete, error, handleDelete }) => {
    const [pass, setPass] = useState<string>('');

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Deletar enquete</h2>
                    <button type="button" className="close" onClick={handleModalDelete}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>Tem certeza que deseja deletar esta enquete?</p>
                </div>
                <div className="modal-input">
                    <input type="password" placeholder="Senha" onChange={(e:ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} />
                    {
                        error && <p className="error">{error}</p>
                    }
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn-cancel" onClick={handleModalDelete}>Cancelar</button>
                    <button type="button" className="btn-delete" onClick={() => handleDelete(pass)}>Deletar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalDelete;

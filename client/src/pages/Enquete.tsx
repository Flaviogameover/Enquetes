import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IEnquetes } from '../interfaces';
import api from '../services';

interface IVote{
    id:number;
    enquete_id?:string;
}

const Enquete:React.FC = () => {
    const [enquete, setEnquete] = useState<IEnquetes>();
    const [vote, setVote] = useState<IVote>();
    const params = useParams<{ id:string }>();
    const [canVote, setCanVote] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        const result = await api.get<IEnquetes>(`/enquetes/${params.id}`);
        setEnquete(result.data);
        if (new Date(result.data.data_termino) < new Date()) {
            setCanVote(false);
        }
    };
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>):Promise<void> => {
        event.preventDefault();
        try {
            const result = await api.put<IVote>(`/enquetes/${params.id}/vote`, { enquete, vote });
            if (result.status === 200) {
                alert('Voto computado com sucesso!');
                fetchData();
            }
        } catch (err:any) {
            alert(err.response.data.error);
        }
    };

    const handleChangeOption = (event:React.ChangeEvent<HTMLInputElement>):void => {
        setVote({
            ...vote,
            id: parseInt(event.target.value, 10),
            enquete_id: enquete?.uniq_id,
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="enquete">
            <Link className="btn-voltar" to="/">
                Voltar
            </Link>
            <h1>{enquete?.titulo}</h1>
            <p>{`Começa ${enquete?.data_inicio} e termina ${enquete?.data_termino}`}</p>
            <form onSubmit={handleSubmit}>
                {enquete?.opcoes.map((opcao:IEnquetes['opcoes'][0]) => (
                    <div key={opcao.id}>
                        <label>
                            <input type="radio" name="opcao" value={opcao.id} onChange={handleChangeOption} />
                            {opcao.titulo_opcao}
                        </label>
                        <span>{`Votos: ${opcao.votos_opcao}`}</span>
                    </div>
                ))}
                <p>{`Total de votos: ${enquete?.votos_total}`}</p>
                {
                    canVote
                        ? <button type="submit">Votar</button>
                        : <p>Enquete encerrada!</p>
                }
            </form>
        </div>
    );
};

export default Enquete;
